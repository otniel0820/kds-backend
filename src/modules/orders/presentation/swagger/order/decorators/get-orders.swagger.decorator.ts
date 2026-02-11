import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ZodValidationErrorSwaggerDto } from '../dtos';
import { GetOrdersResponseSwaggerDto } from '../dtos/get-orders-response.dto';

export function ApiGetOrdersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get orders list',
    }),

    ApiOkResponse({
      description: 'Orders retrieved successfully',
      type: GetOrdersResponseSwaggerDto,
    }),

    ApiBadRequestResponse({
      description: 'DTO validation error',
      type: ZodValidationErrorSwaggerDto,
    }),
  );
}
