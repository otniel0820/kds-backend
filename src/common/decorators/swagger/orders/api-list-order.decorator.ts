import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

import { OrderStatus } from 'src/domain/orders';
import {
  ListOrdersResponseSwaggerDto,
  ValidationErrorSwaggerDto,
  InternalServerErrorSwaggerDto,
} from './dtos';

export function ApiListOrders() {
  return applyDecorators(
    ApiTags('Orders'),

    ApiOperation({
      summary: 'Get orders list',
      description: 'Returns a filtered list of orders',
    }),

    ApiQuery({
      name: 'status',
      required: false,
      isArray: true,
      enum: OrderStatus,
      description: 'Filter orders by status',
    }),

    ApiResponse({
      status: 200,
      description: 'Orders retrieved successfully',
      type: ListOrdersResponseSwaggerDto,
    }),

    ApiResponse({
      status: 400,
      description: 'Validation error',
      type: ValidationErrorSwaggerDto,
    }),

    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: InternalServerErrorSwaggerDto,
    }),
  );
}
