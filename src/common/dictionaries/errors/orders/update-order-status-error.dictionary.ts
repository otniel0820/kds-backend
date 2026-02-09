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
  KDS_ORDER_E0003: {
    status: HttpStatus.CONFLICT,
    code: 'KDS-ORDER-E0003',
    message: 'Order already exists',
    details: {
      displayMessage: {
        ref: '140219-020103-050003',
        en: 'Order already exists',
        es: 'El pedido ya existe',
      },
    },
  },

  KDS_ORDER_E0004: {
    status: HttpStatus.BAD_REQUEST,
    code: 'KDS-ORDER-E0004',
    message: 'Invalid partner slug',
    details: {
      displayMessage: {
        ref: '140219-020103-050004',
        en: 'Invalid partner slug',
        es: 'Slug de partner inválido',
      },
    },
  },

  KDS_ORDER_E0005: {
    status: HttpStatus.BAD_REQUEST,
    code: 'KDS-ORDER-E0005',
    message: 'Invalid product slug',
    details: {
      displayMessage: {
        ref: '140219-020103-050005',
        en: 'Invalid product slug',
        es: 'Slug de producto inválido',
      },
    },
  },
} as const satisfies Record<string, IError>;
