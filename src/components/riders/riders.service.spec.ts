import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RidersService } from './riders.service';
import { Riders } from '../../models/riders.entity';
import { Travels } from '../../models/travels.entity';
import { Drivers } from '../../models/drivers.entity';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { Role } from '../../common/enum/roles.enum';
import { newTravelDto } from '../../common/dto/travel.dto';

describe('RidersService', () => {
  let service: RidersService;

  const mockRidersRepository = {
    findOne: jest.fn((func) => ({
      id: func.where.idUser,
    })),
  };

  const mockTravelsRepository = {
    findOne: jest.fn((travel) => null),
    create: jest.fn((travel) => travel),
    save: jest.fn((newTravel) => ({ id: 13, ...newTravel })),
  };

  const whereSpy = jest.fn().mockReturnThis();
  const innerSpy = jest.fn().mockReturnThis();

  const mockDriversRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      innerJoin: innerSpy,
      where: whereSpy,
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue({ id: 1 }),
    })),
    update: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RidersService,
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
      ],
    }).compile();

    service = module.get<RidersService>(RidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new travel', async () => {
    const user: PayloadInterface = {
      id: 1,
      email: 'dump@gmail.com',
      username: 'dump',
      rol: Role.RIDER,
    };

    let newTravel: newTravelDto = {
      lat_start: '1.121212',
      long_start: '-10.23133',
    };

    expect(await service.createTravel(user, newTravel)).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({
        id: expect.any(Number),
        lat_start: newTravel.lat_start,
        long_start: newTravel.long_start,
        status: 1,
        idDriver: expect.any(Number),
        idRider: expect.any(Number),
        startAt: expect.any(Date),
      }),
    });

    expect(mockRidersRepository.findOne).toBeCalledTimes(1);
    expect(mockTravelsRepository.findOne).toBeCalledTimes(1);
    expect(mockDriversRepository.createQueryBuilder).toBeCalledTimes(1);
    expect(whereSpy).toBeCalledTimes(1);
    expect(innerSpy).toBeCalledTimes(1);
    expect(mockTravelsRepository.create).toBeCalledTimes(1);
    expect(mockTravelsRepository.save).toBeCalledTimes(1);
    expect(mockDriversRepository.update).toBeCalledTimes(1);
  });
});
