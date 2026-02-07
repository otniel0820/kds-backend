import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { timingSafeEqual } from 'crypto';
import { variables } from 'src/config/enviroment.config';
import { buildError } from '../builders';

function safeEqual(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);

  return A.length === B.length && timingSafeEqual(A, B);
}

@Injectable()
export class ValidateCredentialsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(buildError('KDS_AUTH_E0001'));
    }

    const base64Credentials = authHeader.replace('Basic ', '').trim();

    let decoded: string;

    try {
      decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
    } catch {
      throw new UnauthorizedException(buildError('KDS_AUTH_E0002'));
    }

    const [apiKey, apiSecret] = decoded.split(':');

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException(buildError('KDS_AUTH_E0003'));
    }

    const expectedKey = variables.NEST_USER_NAME_GLOVO;
    const expectedSecret = variables.NEST_PASSWORD_GLOVO;

    const validKey = safeEqual(apiKey, expectedKey);
    const validSecret = safeEqual(apiSecret, expectedSecret);

    if (!validKey || !validSecret) {
      throw new UnauthorizedException(buildError('KDS_AUTH_E0004'));
    }

    return true;
  }
}
