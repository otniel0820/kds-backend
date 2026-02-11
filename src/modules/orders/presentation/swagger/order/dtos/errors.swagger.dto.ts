import { ApiProperty } from '@nestjs/swagger';

export class ZodIssueSwaggerDto {
  @ApiProperty({ example: 'source' })
  path!: string;

  @ApiProperty({
    example: 'Invalid input: expected string, received undefined',
  })
  message!: string;
}

export class ZodValidationErrorSwaggerDto {
  @ApiProperty({ example: 400 })
  status!: number;

  @ApiProperty({ example: 'KDS-SYS-E0002' })
  code!: string;

  @ApiProperty({ example: 'Error validation DTO with zod' })
  message!: string;

  @ApiProperty({
    example: {
      issues: [
        {
          path: 'source',
          message: 'Invalid input: expected string, received undefined',
        },
      ],
    },
  })
  details!: {
    issues: ZodIssueSwaggerDto[];
  };
}

export class InvalidPartnerErrorSwaggerDto {
  @ApiProperty({ example: 409 })
  status!: number;

  @ApiProperty({ example: 'KDS-ORDER-E0004' })
  code!: string;

  @ApiProperty({ example: 'Invalid partner slug' })
  message!: string;

  @ApiProperty({
    example: {
      displayMessage: {
        ref: '140219-020103-050004',
        en: 'Invalid partner slug',
        es: 'Slug de partner inválido',
      },
    },
  })
  details!: any;

  @ApiProperty({
    example: '2026-02-11T17:36:47.961Z',
  })
  timestamp!: string;
}

export class OrderNotFoundErrorSwaggerDto {
  @ApiProperty({ example: 404 })
  status!: number;

  @ApiProperty({ example: 'KDS-ORDER-E0001' })
  code!: string;

  @ApiProperty({ example: 'Order not found' })
  message!: string;

  @ApiProperty({
    example: {
      displayMessage: {
        ref: '140219-020103-050001',
        en: 'Order not found',
        es: 'Pedido no encontrado',
      },
    },
  })
  details!: any;

  @ApiProperty({
    example: '2026-02-11T18:03:14.629Z',
  })
  timestamp!: string;
}
