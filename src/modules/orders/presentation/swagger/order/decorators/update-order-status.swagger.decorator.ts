import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import {
  ZodValidationErrorSwaggerDto,
  OrderNotFoundErrorSwaggerDto,
} from '../dtos/errors.swagger.dto';
import {
  UpdateOrderStatusBodySwaggerDto,
  UpdateOrderStatusResponseSwaggerDto,
} from '../dtos/update-order-status-response.dto';

export function ApiUpdateOrderStatusDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update order status',
    }),

    ApiParam({
      name: 'id',
      required: true,
      example: '698c8ebc8118da07e169c1c5',
    }),

    ApiBody({
      type: UpdateOrderStatusBodySwaggerDto,
    }),

    ApiOkResponse({
      description: 'Order status updated successfully',
      type: UpdateOrderStatusResponseSwaggerDto,
    }),

    ApiBadRequestResponse({
      description: 'DTO validation error',
      type: ZodValidationErrorSwaggerDto,
    }),

    ApiNotFoundResponse({
      description: 'Order not found',
      type: OrderNotFoundErrorSwaggerDto,
    }),
  );
}
