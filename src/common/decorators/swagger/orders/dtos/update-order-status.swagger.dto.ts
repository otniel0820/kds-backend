import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/domain/orders';

export class UpdateOrderStatusResponseSwaggerDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'KDS-ORD-R0004' })
  code: string;

  @ApiProperty({ example: 'Order status updated successfully' })
  message: string;
}

class InvalidTransitionDisplayMessageSwaggerDto {
  @ApiProperty({ example: '140219-020103-050002' })
  ref: string;

  @ApiProperty({ example: 'Invalid order status transition' })
  en: string;

  @ApiProperty({ example: 'Transición de estado de pedido no válida' })
  es: string;
}

class InvalidTransitionDetailsSwaggerDto {
  @ApiProperty({
    type: InvalidTransitionDisplayMessageSwaggerDto,
  })
  displayMessage: InvalidTransitionDisplayMessageSwaggerDto;

  @ApiProperty({
    example: 'Invalid transition from CONFIRMED to PICKED_UP',
  })
  reason: string;
}

export class InvalidOrderStatusTransitionSwaggerDto {
  @ApiProperty({ example: 409 })
  status: number;

  @ApiProperty({ example: 'KDS-ORDER-E0002' })
  code: string;

  @ApiProperty({ example: 'Invalid order status transition' })
  message: string;

  @ApiProperty({
    type: InvalidTransitionDetailsSwaggerDto,
  })
  details: InvalidTransitionDetailsSwaggerDto;

  @ApiProperty({
    example: '2026-02-07T21:15:37.014Z',
  })
  timestamp: string;
}

export class UpdateOrderStatusRequestSwaggerDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  toStatus: OrderStatus;
}
