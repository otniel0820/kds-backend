import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusBodySwaggerDto {
  @ApiProperty({
    example: 'CONFIRMED',
    description: 'New order status',
  })
  toStatus!: string;
}

export class UpdateOrderStatusResponseSwaggerDto {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: 'KDS-ORD-R0004' })
  code!: string;

  @ApiProperty({
    example: 'Order status updated successfully',
  })
  message!: string;
}
