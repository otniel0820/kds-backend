import { ApiProperty } from '@nestjs/swagger';

class OrderDetailItemSwaggerDto {
  @ApiProperty({ example: 'b1' })
  sku: string;

  @ApiProperty({ example: 'Burger BBQ' })
  name: string;

  @ApiProperty({ example: 2 })
  qty: number;
}

export class OrderDetailProjectionSwaggerDto {
  @ApiProperty({
    required: false,
    example: 'Juan Pérez',
  })
  customer_name?: string;

  @ApiProperty({
    required: false,
    example: '+34600111222',
  })
  customer_phone?: string;

  @ApiProperty({
    required: false,
    example: 'Calle Gran Vía 123, Madrid',
  })
  delivery_address?: string;

  @ApiProperty({
    required: false,
    example: 'Sin cebolla. Extra salsa.',
  })
  notes?: string;

  @ApiProperty({
    type: [OrderDetailItemSwaggerDto],
  })
  items: OrderDetailItemSwaggerDto[];
}

export class OrderDetailResponseSwaggerDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'KDS-ORD-R0002' })
  code: string;

  @ApiProperty({ example: 'Order detail retrieved successfully' })
  message: string;

  @ApiProperty({
    type: OrderDetailProjectionSwaggerDto,
  })
  data: OrderDetailProjectionSwaggerDto;
}

class DisplayMessageSwaggerDto {
  @ApiProperty({ example: '140219-020103-050001' })
  ref: string;

  @ApiProperty({ example: 'Order not found' })
  en: string;

  @ApiProperty({ example: 'Pedido no encontrado' })
  es: string;
}

class OrderNotFoundDetailsSwaggerDto {
  @ApiProperty({ type: DisplayMessageSwaggerDto })
  displayMessage: DisplayMessageSwaggerDto;
}

export class OrderNotFoundErrorSwaggerDto {
  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: 'KDS-ORDER-E0001' })
  code: string;

  @ApiProperty({ example: 'Order not found' })
  message: string;

  @ApiProperty({
    type: OrderNotFoundDetailsSwaggerDto,
  })
  details: OrderNotFoundDetailsSwaggerDto;

  @ApiProperty({
    example: '2026-02-07T21:00:39.521Z',
  })
  timestamp: string;
}
