import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetOrdersQuerySwaggerDto {
  @ApiPropertyOptional({ example: '698c8ebc8118da07e169c1c5' })
  id?: string;

  @ApiPropertyOptional({ example: 'UBER_EATS-ORDER-1023' })
  externalId?: string;

  @ApiPropertyOptional({ example: 'UBER_EATS' })
  source?: string;

  @ApiPropertyOptional({
    example: ['CONFIRMED', 'PREPARING'],
    isArray: true,
  })
  status?: string[];

  @ApiPropertyOptional({
    example: '2026-02-10T00:00:00.000Z',
    description: 'ISO date',
  })
  createdFrom?: Date;

  @ApiPropertyOptional({
    example: '2026-02-11T23:59:59.999Z',
    description: 'ISO date',
  })
  createdTo?: Date;

  @ApiPropertyOptional({ example: 20, default: 20 })
  limit?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  skip?: number;
}

export class OrderListItemSwaggerDto {
  @ApiProperty({ example: '698c8ebc8118da07e169c1c5' })
  id!: string;

  @ApiProperty({ example: 'Uber Eats' })
  partnerName!: string;

  @ApiProperty({
    example: 'https://i.ibb.co/7xcJS6gY/partner-3.jpg',
  })
  partnerImage!: string;

  @ApiProperty({ example: '0028' })
  displayNumber!: string;

  @ApiProperty({ example: 'CONFIRMED' })
  status!: string;

  @ApiProperty({ example: 'NORMAL' })
  priority!: string;

  @ApiProperty({
    example: '2026-02-11T15:45:15.130Z',
    required: false,
  })
  activeTimer?: string;

  @ApiProperty({
    example: 'Carlos Rodriguez',
    required: false,
  })
  courierName?: string;
}

export class GetOrdersResponseSwaggerDto {
  @ApiProperty({ example: 201 })
  status!: number;

  @ApiProperty({ example: 'KDS-ORD-R0003' })
  code!: string;

  @ApiProperty({ example: 'Order ingested successfully' })
  message!: string;

  @ApiProperty({
    type: [OrderListItemSwaggerDto],
  })
  orders!: OrderListItemSwaggerDto[];

  @ApiProperty({ example: 28 })
  total!: number;
}
