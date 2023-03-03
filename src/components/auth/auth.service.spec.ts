import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { User } from '../../models/users.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    validateUser: jest.fn((email) => ({
      id: 1,
      email,
    })),
    comparePassword: jest.fn().mockReturnValue(true),
  };

  const mockJwtService = {
    sign: jest.fn((payload) => 'token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    let email = 'dump@gmail.com';
    expect(await service.validateUser(email, '123')).toEqual({
      id: expect.any(Number),
      email,
    });
    expect(mockUserService.validateUser).toBeCalledTimes(1);
    expect(mockUserService.comparePassword).toBeCalledTimes(1);
  });

  it('should sign in', async () => {
    const user: any = {
      id: 1,
      email: 'dump@gmail.com',
      username: 'dump',
      rol: { name: 'DUMP' },
    };
    expect(await service.signIn(user)).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({ token: expect.any(String) }),
    });
    expect(mockJwtService.sign).toBeCalledTimes(1);
  });
});
