import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationExceptionFilter } from './common/exceptions/validationException.filter';
import { InternalServerExceptionFilter } from './common/exceptions/internalServerException.filter';
import { successInterceptor } from './common/interceptors/successResponse.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

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

    await app.listen(process.env.PORT || 3000);
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
