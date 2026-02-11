import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IngestOrderItemSwaggerDto {
  @ApiProperty({ example: 'THE_COMBO' })
  slug!: string;

  @ApiProperty({ example: 1 })
  qty!: number;
}

export class IngestOrderSwaggerDto {
  @ApiProperty({ example: 'UBER_EATS' })
  source!: string;

  @ApiProperty({ example: 'UBER_EATS-ORDER-1023' })
  externalId!: string;

  @ApiProperty({ example: 'John Doe' })
  customerName!: string;

  @ApiProperty({ example: '+34600111222' })
  customerPhone!: string;

  @ApiProperty({ example: 'Calle Gran Vía 123, Madrid' })
  deliveryAddress!: string;

  @ApiPropertyOptional({ example: 'No onions please' })
  notes?: string;

  @ApiPropertyOptional({ example: 'NORMAL' })
  priority?: string;

  @ApiProperty({ type: [IngestOrderItemSwaggerDto] })
  items!: IngestOrderItemSwaggerDto[];
}
