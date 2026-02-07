import { HttpStatus } from '@nestjs/common';
import { IError } from 'src/common/schemas';

export const authErrors = {
  KDS_AUTH_E0001: {
    status: HttpStatus.UNAUTHORIZED,
    code: 'KDS-AUTH-E0001',
    message: 'Invalid or missing Authorization header',
  },

  KDS_AUTH_E0002: {
    status: HttpStatus.UNAUTHORIZED,
    code: 'KDS-AUTH-E0002',
    message: 'Malformed authorization credentials',
  },

  KDS_AUTH_E0003: {
    status: HttpStatus.UNAUTHORIZED,
    code: 'KDS-AUTH-E0003',
    message: 'Invalid credential structure',
  },

  KDS_AUTH_E0004: {
    status: HttpStatus.UNAUTHORIZED,
    code: 'KDS-AUTH-E0004',
    message: 'Invalid credentials',
  },
} as const satisfies Record<string, IError>;
