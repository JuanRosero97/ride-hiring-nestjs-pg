import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { Travels } from '../../models/travels.entity';
import { Riders } from '../../models/riders.entity';
import { Drivers } from '../../models/drivers.entity';
import { Transactions } from '../../models/transactions.entity';
import { closeTravelDto } from '../../common/dto/travel.dto';
import { PayloadInterface } from '../../common/interfaces/payload.interface';
import { Role } from '../../common/enum/roles.enum';
import { ConfigModule } from '@nestjs/config';
const axios = require('axios');
jest.mock('axios');

describe('DriversService', () => {
  let service: DriversService;

  const whereSpy = jest.fn().mockReturnThis();
  const innerSpy = jest.fn().mockReturnThis();
  const mockRidersRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      innerJoinAndSelect: innerSpy,
      where: whereSpy,
      getOne: jest.fn().mockReturnValue({
        id_payment_source: 1,
        idUserRider: { email: 'dump@gmail.com' },
      }),
    })),
  };

  const mockTravelsRepository = {
    findOne: jest.fn().mockReturnValue({
      id: 10,
      lat_start: '1.411',
      long_start: '-7.2369',
      startAt: '2023-03-02T19:38:54.339Z',
    }),
    update: jest.fn().mockReturnThis(),
  };

  const mockDriversRepository = {
    findOne: jest.fn((func) => ({
      id: func.where.idUser,
    })),
    update: jest.fn().mockReturnThis(),
  };

  const mockTransactionsRepository = {
    create: jest.fn((newTrx) => ({ id: 1, ...newTrx })),
    save: jest.fn((trx) => trx),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        DriversService,
        {
          provide: getRepositoryToken(Riders),
          useValue: mockRidersRepository,
        },
        {
          provide: getRepositoryToken(Travels),
          useValue: mockTravelsRepository,
        },
        {
          provide: getRepositoryToken(Drivers),
          useValue: mockDriversRepository,
        },
        {
          provide: getRepositoryToken(Transactions),
          useValue: mockTransactionsRepository,
        },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction', async () => {
    const user: PayloadInterface = {
      id: 1,
      email: 'dump@gmail.com',
      username: 'dump',
      rol: Role.RIDER,
    };

    let closeTravel: closeTravelDto = {
      lat_end: '1.411',
      long_end: '-7.3369',
      installments: 2,
    };

    /* Mock axios response */
    const expectedResponse = {
      data: { data: { id: 'idwompitransaction' } },
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(expectedResponse));

    expect(await service.finishedTravel(user, 1, closeTravel)).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({
        id: expect.any(Number),
        reference: expect.any(String),
        idTrxWompi: expect.any(String),
        status: 0,
        idTravel: expect.any(Number),
        total: expect.any(String),
        createdAt: expect.any(Date),
      }),
    });

    expect(mockDriversRepository.findOne).toBeCalledTimes(1);
    expect(mockDriversRepository.update).toBeCalledTimes(1);

    expect(mockRidersRepository.createQueryBuilder).toBeCalledTimes(1);
    expect(innerSpy).toBeCalledTimes(1);
    expect(whereSpy).toBeCalledTimes(1);

    expect(mockTravelsRepository.findOne).toBeCalledTimes(1);
    expect(mockTravelsRepository.update).toBeCalledTimes(1);

    expect(mockTransactionsRepository.create).toBeCalledTimes(1);
    expect(mockTransactionsRepository.save).toBeCalledTimes(1);

    expect(axios.post).toBeCalledTimes(1);
  });
});
