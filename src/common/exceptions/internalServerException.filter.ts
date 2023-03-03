import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Catch()
export class InternalServerExceptionFilter implements ExceptionFilter {
  private logger = new Logger(InternalServerExceptionFilter.name);
  public catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let msg =
      exception instanceof HttpException ? exception.getResponse() : exception;

    msg = msg.error ? msg.error : msg.message ? msg.message : msg;

    let status = exception.status
      ? exception.status === 401 || exception.status === 403
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.ACCEPTED
      : HttpStatus.ACCEPTED;

    this.logger.error(`Error: ${msg}`);
    response.status(status).json({
      status: false,
      error: 'Internal Server Error',
      message: msg,
      data: [],
    });
  }
}
