import { Test, TestingModule } from '@nestjs/testing';
import { closeTravelDto } from 'src/common/dto/travel.dto';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

describe('DriversController', () => {
  let controller: DriversController;

  const mockDriversService = {
    finishedTravel: jest.fn((user, id, closeTravel) => ({
      message: 'Travel finished',
      data: {
        id: 1,
        reference: 'newreference',
        idTrxWompi: 'newidtrxwompi',
        status: 0,
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService],
    })
      .overrideProvider(DriversService)
      .useValue(mockDriversService)
      .compile();

    controller = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a close Travel', async () => {
    let closeTravel: closeTravelDto = {
      lat_end: '1.411',
      long_end: '-7.3369',
      installments: 2,
    };

    expect(await controller.finishedTravel({}, 1, closeTravel)).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({
        id: expect.any(Number),
        reference: expect.any(String),
        idTrxWompi: expect.any(String),
        status: 0,
      }),
    });

    expect(mockDriversService.finishedTravel).toBeCalledTimes(1);
  });
});
