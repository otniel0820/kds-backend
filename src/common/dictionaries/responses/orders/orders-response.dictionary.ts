import { HttpStatus } from '@nestjs/common';
import { IResponse } from 'src/common/schemas';

export const orderResponses = {
  KDS_ORD_R0001: {
    status: HttpStatus.OK,
    code: 'KDS-ORD-R0001',
    message: 'Orders retrieved successfully',
  },

  KDS_ORD_R0002: {
    status: HttpStatus.OK,
    code: 'KDS-ORD-R0002',
    message: 'Order detail retrieved successfully',
  },

  KDS_ORD_R0003: {
    status: HttpStatus.CREATED,
    code: 'KDS-ORD-R0003',
    message: 'Order ingested successfully',
  },

  KDS_ORD_R0004: {
    status: HttpStatus.OK,
    code: 'KDS-ORD-R0004',
    message: 'Order status updated successfully',
  },
} as const satisfies Record<string, IResponse>;
