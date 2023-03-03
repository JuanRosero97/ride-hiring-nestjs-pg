import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { closeTravelDto } from 'src/common/dto/travel.dto';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { Drivers } from '../../models/drivers.entity';
import { Riders } from '../../models/riders.entity';
import { Travels } from '../../models/travels.entity';
import { Repository } from 'typeorm';
import getDistanceFromLatLonInKm from '../../common/util/calculateDistance';
import * as moment from 'moment';
import { Transactions } from '../../models/transactions.entity';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Riders) private ridersRepository: Repository<Riders>,
    @InjectRepository(Travels) private travelsRepository: Repository<Travels>,
    @InjectRepository(Drivers) private driversRepository: Repository<Drivers>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async finishedTravel(
    user: PayloadInterface,
    id: number,
    closeTravel: closeTravelDto,
  ) {
    let endAt = new Date();
    let reference = uuidv4();

    /* check if is driver */
    let findDriver = await this.driversRepository.findOne({
      where: { idUser: user.id },
    });
    if (!findDriver) throw new Error('Driver not found');

    /* check if travel exists and is yours */
    let travel = await this.travelsRepository.findOne({
      where: { id, idDriver: findDriver.id, status: 1 },
    });
    if (!travel) throw new Error('Travel not found or is all ready finished');

    /* calculate distance of travel */
    let distance = getDistanceFromLatLonInKm(
      travel.lat_start,
      travel.long_start,
      closeTravel.lat_end,
      closeTravel.long_end,
    );

    /* calculate time of travel */
    let time = moment(endAt).diff(travel.startAt, 'minutes');

    /* Calculate price of travel */
    let total =
      Number(distance) * Number(process.env.PER_KM) +
      Number(time) * Number(process.env.PER_MINUTE) +
      Number(process.env.BASE_FEE);

    /* Wompi transaction */

    let findRider = await this.ridersRepository
      .createQueryBuilder('riders')
      .innerJoinAndSelect('riders.idUserRider', 'user')
      .where('riders.id = :id', { id: travel.idRider })
      .getOne();

    let transaction = {
      amount_in_cents: total * 100,
      currency: 'COP',
      customer_email: findRider.idUserRider.email,
      payment_method: {
        installments: closeTravel.installments,
      },
      reference: reference,
      payment_source_id: findRider.id_payment_source,
    };

    /* Fetch api wompi */
    const resp = await axios.post(
      process.env.EXTERNAL_API_URL + '/transactions',
      transaction,
      {
        headers: {
          Authorization: `Bearer ${process.env.EXTERNAL_API_PRIVATE_KEY}`,
        },
      },
    );

    /* create transaction */
    let startTransaction = this.transactionsRepository.create({
      reference,
      idTrxWompi: resp.data.data.id,
      idTravel: travel.id,
      total: total.toString(),
      createdAt: endAt,
      status: 0,
    });
    let createTransaction = await this.transactionsRepository.save(
      startTransaction,
    );

    /* update travel */
    let updateTravel = await this.travelsRepository.update(travel.id, {
      lat_end: closeTravel.lat_end,
      long_end: closeTravel.long_end,
      endAt,
      status: 2,
      total: total.toString(),
    });

    /* update available status driver */
    await this.driversRepository.update(findDriver.id, { available: 1 });

    return { message: 'Transaction created', data: createTransaction };
  }
}
