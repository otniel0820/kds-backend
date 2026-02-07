import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { InternalServerErrorSwaggerDto } from './dtos';
import {
  OrderDetailResponseSwaggerDto,
  OrderNotFoundErrorSwaggerDto,
} from './dtos/order-details.swagger.dto';

export function ApiGetOrderDetail() {
  return applyDecorators(
    ApiTags('Orders'),

    ApiOperation({
      summary: 'Get order detail',
      description:
        'Returns detailed information of a specific order (detail projection).',
    }),

    ApiParam({
      name: 'id',
      required: true,
      description: 'Order identifier',
    }),

    ApiResponse({
      status: 200,
      description: 'Order detail retrieved successfully',
      type: OrderDetailResponseSwaggerDto,
    }),

    ApiResponse({
      status: 404,
      description: 'Order not found',
      type: OrderNotFoundErrorSwaggerDto,
    }),

    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: InternalServerErrorSwaggerDto,
    }),
  );
}
