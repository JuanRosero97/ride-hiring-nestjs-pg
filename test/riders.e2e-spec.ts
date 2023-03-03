import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { successInterceptor } from '../src/common/interceptors/successResponse.interceptor';
import { InternalServerExceptionFilter } from '../src/common/exceptions/internalServerException.filter';
import { ValidationExceptionFilter } from '../src/common/exceptions/validationException.filter';
import { JwtAuthGuard } from '../src/components/auth/guards/jwt-auth.guard';
import { newTravelDto } from 'src/common/dto/travel.dto';
import { RidersModule } from '../src/components/riders/riders.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../src/configuration/db_config';

describe('RidersController (integration test)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => dbConfig,
        }),
        RidersModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            username: 'rider1',
            email: 'rider1@gmail.com',
            id: 2,
            rol: 'RIDER',
          };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors: any) => {
          let msgs = errors
            .map((d) => Object.values(d.constraints).filter(Boolean))
            .join('. ');
          return new BadRequestException({
            error: 'Bad Request Validation',
            message: msgs,
          });
        },
      }),
    );
    app.useGlobalInterceptors(new successInterceptor());
    app.useGlobalFilters(new InternalServerExceptionFilter());
    app.useGlobalFilters(new ValidationExceptionFilter());

    await app.init();
  });

  it('/riders/new-travel (POST) - create new travel', async () => {
    let newTravel: newTravelDto = {
      lat_start: '2.451514',
      long_start: '-76.598995',
    };

    let req = await request(app.getHttpServer())
      .post('/riders/new-travel')
      .send(newTravel)
      .then((res) => {
        if (res.status === 201) {
          expect(res.body).toEqual({
            status: true,
            message: expect.any(String),
            error: null,
            data: expect.objectContaining({
              idDriver: expect.any(Number),
              idRider: expect.any(Number),
              startAt: expect.any(String),
              lat_start: newTravel.lat_start,
              long_start: newTravel.long_start,
              status: 1,
              endAt: null,
              lat_end: null,
              long_end: null,
              total: null,
              id: expect.any(Number),
            }),
          });
        } else {
          expect(res.body).toEqual({
            status: false,
            error: 'Internal Server Error',
            message: expect.any(String),
            data: [],
          });
        }
      });
  });
});
