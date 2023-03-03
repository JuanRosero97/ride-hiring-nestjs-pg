import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/components/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../src/configuration/db_config';
import { successInterceptor } from '../src/common/interceptors/successResponse.interceptor';
import { InternalServerExceptionFilter } from '../src/common/exceptions/internalServerException.filter';
import { ValidationExceptionFilter } from '../src/common/exceptions/validationException.filter';

describe('AuthController (integration test)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => dbConfig,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new successInterceptor());
    app.useGlobalFilters(new InternalServerExceptionFilter());
    app.useGlobalFilters(new ValidationExceptionFilter());
    await app.init();
  });

  it('/auth/signin (POST)', async () => {
    let loginUser = { email: 'rider1@gmail.com', password: '123' };
    return await request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginUser)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          status: true,
          message: expect.any(String),
          error: null,
          data: expect.objectContaining({
            token: expect.any(String),
          }),
        });
      });
  });

  it('/auth/signin (POST) - invalid email', async () => {
    let loginUser = { email: '', password: '123' };
    return await request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginUser)
      .expect(401);
  });
});
