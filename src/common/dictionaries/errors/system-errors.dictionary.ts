import { HttpStatus } from '@nestjs/common';
import { IError } from 'src/common/schemas/error.schema';

export const systemErrors = {
  KDS_SYS_E0000: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'KDS-SYS-E0000',
    message: 'Unknow System Error',
  },
  KDS_SYS_E0001: {
    status: HttpStatus.NOT_FOUND,
    code: 'KDS-SYS-E0001',
    message: 'System Variable not found',
  },
  KDS_SYS_E0002: {
    status: HttpStatus.BAD_REQUEST,
    code: 'KDS-SYS-E0002',
    message: 'Error validation DTO with zod',
  },
} as const satisfies Record<string, IError>;
