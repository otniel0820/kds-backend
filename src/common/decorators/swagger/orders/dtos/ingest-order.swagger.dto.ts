import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects/order-priority.vo';

class IngestOrderItemSwaggerDto {
  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    example: 2,
  })
  qty: number;
}

export class IngestOrderSwaggerDto {
  @ApiProperty({
    example: 'GLOVO',
  })
  source: string;

  @ApiProperty({
    example: 'EXT-123456',
  })
  externalId: string;

  @ApiProperty({
    required: false,
    example: 'John Doe',
  })
  customerName?: string;

  @ApiProperty({
    required: false,
    example: '+34600000000',
  })
  customerPhone?: string;

  @ApiProperty({
    required: false,
    example: 'Calle Falsa 123',
  })
  deliveryAddress?: string;

  @ApiProperty({
    required: false,
    example: 'No onions please',
  })
  notes?: string;

  @ApiProperty({
    required: false,
    enum: OrderPriority,
    example: OrderPriority.NORMAL,
  })
  priority?: OrderPriority;

  @ApiProperty({
    type: [IngestOrderItemSwaggerDto],
  })
  items: IngestOrderItemSwaggerDto[];
}

class OrderItemSwaggerDto {
  @ApiProperty() sku: string;
  @ApiProperty() name: string;
  @ApiProperty() qty: number;
}

class OrderTimersSwaggerDto {
  @ApiProperty({ required: false }) placedAt?: string;
}

class OrderSwaggerDto {
  @ApiProperty() id: string;
  @ApiProperty() source: string;
  @ApiProperty() externalId: string;
  @ApiProperty() displayNumber: string;

  @ApiProperty({ enum: OrderPriority })
  priority: OrderPriority;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemSwaggerDto] })
  items: OrderItemSwaggerDto[];

  @ApiProperty({ type: OrderTimersSwaggerDto })
  timers: OrderTimersSwaggerDto;

  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class IngestOrderResponseSwaggerDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'KDS-ORD-R0003' })
  code: string;

  @ApiProperty({ example: 'Order ingested successfully' })
  message: string;

  @ApiProperty({
    type: OrderSwaggerDto,
  })
  data: OrderSwaggerDto;
}

export class BaseErrorResponseSwaggerDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  timestamp?: string;

  @ApiProperty({
    required: false,
    type: Object,
  })
  details?: Record<string, unknown>;
}

export class ValidationErrorSwaggerDto {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'KDS-SYS-E0002' })
  code: string;

  @ApiProperty({ example: 'Error validation DTO with zod' })
  message: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  timestamp?: string;

  @ApiProperty({
    example: {
      source: 'Required',
    },
    type: Object,
  })
  details?: Record<string, unknown>;
}

export class AuthErrorSwaggerDto {
  @ApiProperty({ example: 401 })
  status: number;

  @ApiProperty({ example: 'KDS-AUTH-E0004' })
  code: string;

  @ApiProperty({ example: 'Invalid credentials' })
  message: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  timestamp?: string;

  @ApiProperty({
    example: {},
    type: Object,
  })
  details?: Record<string, unknown>;
}

export class InternalServerErrorSwaggerDto {
  @ApiProperty({ example: 500 })
  status: number;

  @ApiProperty({ example: 'KDS-SYS-E0000' })
  code: string;

  @ApiProperty({ example: 'Unknow System Error' })
  message: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  timestamp?: string;

  @ApiProperty({
    example: {},
    type: Object,
  })
  details?: Record<string, unknown>;
}
