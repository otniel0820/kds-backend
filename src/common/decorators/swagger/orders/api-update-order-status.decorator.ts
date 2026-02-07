import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  UpdateOrderStatusRequestSwaggerDto,
  UpdateOrderStatusResponseSwaggerDto,
  ValidationErrorSwaggerDto,
  OrderNotFoundErrorSwaggerDto,
  InvalidOrderStatusTransitionSwaggerDto,
  InternalServerErrorSwaggerDto,
} from './dtos';

export function ApiUpdateOrderStatus() {
  return applyDecorators(
    ApiTags('Orders'),

    ApiOperation({
      summary: 'Update order status',
      description:
        'Updates the status of an existing order following valid state transitions.',
    }),

    ApiParam({
      name: 'id',
      required: true,
      description: 'Order identifier',
    }),

    ApiBody({
      type: UpdateOrderStatusRequestSwaggerDto,
    }),

    ApiResponse({
      status: 200,
      description: 'Order status updated successfully',
      type: UpdateOrderStatusResponseSwaggerDto,
    }),

    ApiResponse({
      status: 400,
      description: 'Validation error',
      type: ValidationErrorSwaggerDto,
    }),

    ApiResponse({
      status: 404,
      description: 'Order not found',
      type: OrderNotFoundErrorSwaggerDto,
    }),

    ApiResponse({
      status: 409,
      description: 'Invalid order status transition',
      type: InvalidOrderStatusTransitionSwaggerDto,
    }),

    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: InternalServerErrorSwaggerDto,
    }),
  );
}
