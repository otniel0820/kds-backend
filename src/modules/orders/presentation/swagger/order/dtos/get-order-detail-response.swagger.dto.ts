import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailSwaggerDto {
  @ApiProperty({ example: '698919b18e3a8662a14a221f' })
  id!: string;

  @ApiProperty({ example: 'The Combo' })
  name!: string;

  @ApiProperty({
    example: 'https://i.ibb.co/d06QdTHw/product-1.jpg',
  })
  image!: string;

  @ApiProperty({ example: 14.99 })
  price!: number;

  @ApiProperty({ example: 'EUR' })
  currency!: string;
}

export class OrderDetailItemSwaggerDto {
  @ApiProperty({ example: 1 })
  qty!: number;

  @ApiProperty({ type: ProductDetailSwaggerDto })
  product!: ProductDetailSwaggerDto;
}

export class OrderDetailDataSwaggerDto {
  @ApiProperty({ example: 'No onions please' })
  notes!: string;

  @ApiProperty({ type: [OrderDetailItemSwaggerDto] })
  items!: OrderDetailItemSwaggerDto[];

  @ApiProperty({ example: 'John Doe' })
  customerName!: string;

  @ApiProperty({ example: '+34600111222' })
  customerPhone!: string;

  @ApiProperty({ example: 'Calle Gran Vía 123, Madrid' })
  deliveryAddress!: string;
}

export class GetOrderDetailResponseSwaggerDto {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: 'KDS-ORD-R0002' })
  code!: string;

  @ApiProperty({
    example: 'Order detail retrieved successfully',
  })
  message!: string;

  @ApiProperty({ type: OrderDetailDataSwaggerDto })
  data!: OrderDetailDataSwaggerDto;
}
