import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';

export class OrderListItemSwaggerDto {
  @ApiProperty({ example: '6987a600cf90523c84c55d2c' })
  id: string;

  @ApiProperty({ example: 'uber_eats' })
  source: string;

  @ApiProperty({ example: '0002' })
  displayNumber: string;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.RECEIVED,
  })
  status: OrderStatus;

  @ApiProperty({
    enum: OrderPriority,
    example: OrderPriority.HIGH,
  })
  priority: OrderPriority;

  @ApiProperty({
    required: false,
    example: '2026-02-07T20:52:16.934Z',
  })
  activeTimer?: string;
}

export class ListOrdersResponseSwaggerDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'KDS-ORD-R0001' })
  code: string;

  @ApiProperty({ example: 'Orders retrieved successfully' })
  message: string;

  @ApiProperty({
    type: [OrderListItemSwaggerDto],
  })
  data: OrderListItemSwaggerDto[];
}
