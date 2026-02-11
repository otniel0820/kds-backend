import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBasicAuth,
  ApiConsumes,
} from '@nestjs/swagger';

import { UpdateOrderWebhookBodySwaggerDto } from '../dtos/update-order-webhook-body.swagger.dto';
import {
  ZodValidationErrorSwaggerDto,
  OrderNotFoundErrorSwaggerDto,
} from '../dtos/errors.swagger.dto';

export function ApiUpdateOrderWebhookDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update order status from external webhook',
      description: 'Receives partner webhook event and updates order status',
    }),

    ApiBasicAuth('basicAuth'),

    ApiConsumes('application/json'),

    ApiBody({
      type: UpdateOrderWebhookBodySwaggerDto,
      required: true,
    }),

    ApiNoContentResponse({
      description: 'Order status updated successfully via webhook',
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
