import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../models/users.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  const whereSpy = jest.fn().mockReturnThis();
  const innerSpy = jest.fn().mockReturnThis();

  const mockUserRepository = {
    createQueryBuilder: jest.fn(() => ({
      innerJoinAndSelect: innerSpy,
      where: whereSpy,
      getOne: jest.fn().mockReturnValue({
        id: 1,
        email: 'some@gmail.com',
      }),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    expect(await service.validateUser('dumb@gmail.com')).toEqual({
      id: expect.any(Number),
      email: expect.any(String),
    });
    expect(innerSpy).toBeCalledTimes(1);
    expect(whereSpy).toBeCalledTimes(1);
  });

  it('should compare password', async () => {
    expect(
      await service.comparePassword(
        '$2a$12$Vgz2FepPvM3uNTqiJ7.X/O6XNZg1M.4CCBQT3UtD9NxgJSBr235l6',
        '123',
      ),
    ).toBe(true);
  });
});
