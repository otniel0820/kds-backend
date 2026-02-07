import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects/order-priority.vo';

export type OrderMongoDocument = HydratedDocument<OrderMongoModel> & {
  created_at: Date;
  updated_at: Date;
};

@Schema({
  collection: 'orders',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class OrderMongoModel {
  @Prop({ required: true })
  source!: string;

  @Prop({ required: true, alias: 'external_id' })
  externalId!: string;

  @Prop({ required: true, alias: 'display_number' })
  displayNumber!: string;

  @Prop({ required: true, enum: OrderStatus })
  status!: OrderStatus;

  @Prop({
    required: true,
    enum: OrderPriority,
    default: OrderPriority.NORMAL,
  })
  priority!: OrderPriority;

  @Prop({ required: false, alias: 'customer_name' })
  customerName?: string;

  @Prop({ required: false, alias: 'customer_phone' })
  customerPhone?: string;

  @Prop({ required: false, alias: 'delivery_address' })
  deliveryAddress?: string;

  @Prop({ required: false, alias: 'courier_name' })
  courierName?: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({
    type: [{ sku: String, name: String, qty: Number }],
    default: [],
    _id: false,
  })
  items!: {
    sku: string;
    name: string;
    qty: number;
  }[];

  @Prop({
    type: {
      placed_at: { type: Date },
      confirmed_at: { type: Date },
      preparing_at: { type: Date },
      ready_at: { type: Date },
      picked_up_at: { type: Date },
      delivered_at: { type: Date },
      cancelled_at: { type: Date },
    },
    default: {},
  })
  timers!: {
    placed_at?: Date;
    confirmed_at?: Date;
    preparing_at?: Date;
    ready_at?: Date;
    picked_up_at?: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
  };
}

export const OrderMongoSchema = SchemaFactory.createForClass(OrderMongoModel);

OrderMongoSchema.index({ source: 1, externalId: 1 }, { unique: true });
OrderMongoSchema.index({ status: 1, created_at: -1 });
OrderMongoSchema.index({ displayNumber: 1 });
