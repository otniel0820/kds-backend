import { HttpStatus } from '@nestjs/common';
import type { IError } from 'src/common/schemas/error.schema';

export const ordersErrors = {
  KDS_ORDER_E0001: {
    status: HttpStatus.NOT_FOUND,
    code: 'KDS-ORDER-E0001',
    message: 'Order not found',
    details: {
      displayMessage: {
        ref: '140219-020103-050001',
        en: 'Order not found',
        es: 'Pedido no encontrado',
      },
    },
  },
  KDS_ORDER_E0002: {
    status: HttpStatus.CONFLICT,
    code: 'KDS-ORDER-E0002',
    message: 'Invalid order status transition',
    details: {
      displayMessage: {
        ref: '140219-020103-050002',
        en: 'Invalid order status transition',
        es: 'Transición de estado de pedido no válida',
      },
    },
  },
} as const satisfies Record<string, IError>;
