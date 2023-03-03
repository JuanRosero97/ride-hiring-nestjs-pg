import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { newTravelDto } from 'src/common/dto/travel.dto';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { Riders } from '../../models/riders.entity';
import { Repository } from 'typeorm';
import { Travels } from '../../models/travels.entity';
import { Drivers } from '../../models/drivers.entity';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(Riders) private ridersRepository: Repository<Riders>,
    @InjectRepository(Travels) private travelsRepository: Repository<Travels>,
    @InjectRepository(Drivers) private driversRepository: Repository<Drivers>,
  ) {}

  async createTravel(user: PayloadInterface, newTravel: newTravelDto) {
    /* check if is rider */
    let findRider = await this.ridersRepository.findOne({
      where: { idUser: user.id },
    });

    if (!findRider) throw new Error('You are not a rider');

    /* search for an active travel */
    let findTravel = await this.travelsRepository.findOne({
      where: { status: 1, idRider: findRider.id },
    });

    if (findTravel) throw new Error('You already have a travel in progress');

    /* search for an random active driver */
    let findDriver = await this.driversRepository
      .createQueryBuilder('drivers')
      .select('drivers.id')
      .innerJoin('drivers.idUserDriver', 'user')
      .where('drivers.available = 1 AND user.status = 1')
      .orderBy('RANDOM()')
      .getOne();

    if (!findDriver) throw new Error('Not drivers available or active');

    /* create a new travel */

    let travel: any = {
      ...newTravel,
      idRider: findRider.id,
      idDriver: findDriver.id,
      status: 1,
      startAt: new Date(),
    };

    let startTravel = this.travelsRepository.create(travel);
    let travelCreate = await this.travelsRepository.save(startTravel);

    /* update available status driver */
    await this.driversRepository.update(findDriver.id, { available: 0 });

    return { message: 'Travel created', data: travelCreate };
  }
}
