import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  IngestOrderSwaggerDto,
  IngestOrderResponseSwaggerDto,
  ValidationErrorSwaggerDto,
  AuthErrorSwaggerDto,
  InternalServerErrorSwaggerDto,
} from './dtos';

export function ApiIngestOrder() {
  return applyDecorators(
    ApiTags('Orders'),

    ApiSecurity('basicAuth'),

    ApiOperation({
      summary: 'Ingest external order',
      description:
        'Receives a webhook order from an external provider and creates or returns an existing order.',
    }),

    ApiBody({
      type: IngestOrderSwaggerDto,
    }),

    ApiResponse({
      status: 201,
      description: 'Order ingested successfully',
      type: IngestOrderResponseSwaggerDto,
    }),

    ApiResponse({
      status: 400,
      description: 'Validation error',
      type: ValidationErrorSwaggerDto,
    }),

    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
      type: AuthErrorSwaggerDto,
    }),

    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: InternalServerErrorSwaggerDto,
    }),
  );
}
