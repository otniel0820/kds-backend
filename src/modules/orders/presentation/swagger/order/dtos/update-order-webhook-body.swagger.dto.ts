import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderWebhookBodySwaggerDto {
  @ApiProperty({
    example: 'UBER_EATS',
  })
  source!: string;

  @ApiProperty({
    example: 'UBER_EATS-ORDER-1023',
  })
  externalId!: string;

  @ApiProperty({
    example: 'DELIVERED',
    enum: ['PICKED_UP', 'DELIVERED', 'CANCELLED'],
  })
  toStatus!: 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
}
