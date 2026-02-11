import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';

import {
  ZodValidationErrorSwaggerDto,
  OrderNotFoundErrorSwaggerDto,
} from '../dtos/errors.swagger.dto';
import { GetOrderDetailResponseSwaggerDto } from '../dtos';

export function ApiGetOrderDetailDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get order detail by id',
    }),

    ApiParam({
      name: 'id',
      required: true,
      example: '698c8ebc8118da07e169c1c5',
    }),

    ApiOkResponse({
      description: 'Order detail retrieved successfully',
      type: GetOrderDetailResponseSwaggerDto,
    }),

    ApiBadRequestResponse({
      description: 'Invalid id format',
      type: ZodValidationErrorSwaggerDto,
    }),

    ApiNotFoundResponse({
      description: 'Order not found',
      type: OrderNotFoundErrorSwaggerDto,
    }),
  );
}
