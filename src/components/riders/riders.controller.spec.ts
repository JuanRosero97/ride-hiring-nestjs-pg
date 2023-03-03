import { Test, TestingModule } from '@nestjs/testing';
import { RidersController } from './riders.controller';
import { RidersService } from './riders.service';
import { newTravelDto } from '../../common/dto/travel.dto';

describe('RidersController', () => {
  let controller: RidersController;

  let mockRidersService = {
    createTravel: jest.fn((res, newTravel) => ({
      message: 'Travel created',
      data: {
        id: 1,
        lat_start: newTravel.lat_start,
        long_start: newTravel.long_start,
        status: 1,
        idDriver: 1,
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RidersController],
      providers: [RidersService],
    })
      .overrideProvider(RidersService)
      .useValue(mockRidersService)
      .compile();

    controller = module.get<RidersController>(RidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new Travel', async () => {
    let newTravel: newTravelDto = {
      lat_start: '1.121212',
      long_start: '-10.23133',
    };
    expect(await controller.createTravel({}, newTravel)).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({
        id: expect.any(Number),
        lat_start: newTravel.lat_start,
        long_start: newTravel.long_start,
        status: 1,
        idDriver: expect.any(Number),
      }),
    });

    expect(mockRidersService.createTravel).toBeCalledTimes(1);
  });
});
