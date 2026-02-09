import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';

import { buildError } from 'src/common/builders/error.builder';
import { resolveAppError } from '../dictionaries/errors/error-resolver.dictionary';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      return res.status(status).json(body);
    }

    const errObj =
      exception instanceof Error ? exception : new Error('UNKNOWN');

    const resolved = resolveAppError(errObj);
    if (resolved) {
      return res.status(resolved.status).json({
        ...resolved,
        timestamp: new Date(),
      });
    }

    const sys = buildError('KDS_SYS_E0000', {
      originalMessage: errObj.message,
    });
    return res.status(sys.status).json({
      ...sys,
      timestamp: new Date(),
    });
  }
}
