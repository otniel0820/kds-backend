import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiBasicAuth,
  ApiConsumes,
  ApiConflictResponse,
} from '@nestjs/swagger';

import {
  ZodValidationErrorSwaggerDto,
  InvalidPartnerErrorSwaggerDto,
} from '../dtos/errors.swagger.dto';
import { IngestOrderSwaggerDto } from '../dtos';

export function ApiIngestOrderDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Ingest external order',
    }),

    ApiBasicAuth('basicAuth'),

    ApiConsumes('application/json'),

    ApiBody({
      type: IngestOrderSwaggerDto,
      required: true,
    }),

    ApiNoContentResponse({
      description: 'Order successfully ingested',
    }),

    ApiBadRequestResponse({
      description: 'DTO validation error',
      type: ZodValidationErrorSwaggerDto,
    }),

    ApiConflictResponse({
      description: 'Invalid partner slug',
      type: InvalidPartnerErrorSwaggerDto,
    }),
  );
}
