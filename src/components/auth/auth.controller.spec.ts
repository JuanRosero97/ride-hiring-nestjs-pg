import { Test, TestingModule } from '@nestjs/testing';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  signIn: jest.fn((dto) => {
    return {
      message: 'Login success',
      data: { token: 'token' },
    };
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('it should user signed in', async () => {
    const user: PayloadInterface = {
      id: 1,
      email: 'dump@gmail.com',
      username: 'dump',
      rol: 'DUMP',
    };
    expect(await controller.signin({ user })).toEqual({
      message: expect.any(String),
      data: expect.objectContaining({ token: expect.any(String) }),
    });

    expect(mockAuthService.signIn).toBeCalledTimes(1);
  });
});
