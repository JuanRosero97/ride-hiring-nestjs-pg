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
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../src/configuration/db_config';
import { DriversModule } from '../src/components/drivers/drivers.module';
import { closeTravelDto } from '../src/common/dto/travel.dto';

describe('DriversController (integration test)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => dbConfig,
        }),
        DriversModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            username: 'driver1',
            email: 'driver1@gmail.com',
            id: 5,
            rol: 'DRIVER',
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

  it('/finished-travel/:id (PUT) - finished travel', async () => {
    let closeTravel: closeTravelDto = {
      lat_end: '2.458921087476381',
      long_end: '-76.63527666213369',
      installments: 2,
    };
    let idTravel = 13;

    let req = await request(app.getHttpServer())
      .put(`/drivers/finished-travel/${idTravel}`)
      .send(closeTravel)
      .then((res) => {
        if (res.status === 200) {
          expect(res.body).toEqual({
            status: true,
            message: expect.any(String),
            error: null,
            data: expect.objectContaining({
              reference: expect.any(String),
              idTrxWompi: expect.any(String),
              idTravel,
              total: expect.any(String),
              createdAt: expect.any(String),
              status: 0,
              wompiResponse: null,
              approvalAt: null,
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
