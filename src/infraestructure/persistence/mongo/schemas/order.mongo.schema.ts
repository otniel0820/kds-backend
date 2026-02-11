import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects/order-priority.vo';
import { PartnerMongoModel } from './partners.schema';

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

  @Prop({ required: true })
  external_id!: string;

  @Prop({
    type: Types.ObjectId,
    ref: PartnerMongoModel.name,
  })
  partner?: Types.ObjectId;

  @Prop({ required: true })
  display_number!: string;

  @Prop({ required: true, enum: OrderStatus })
  status!: OrderStatus;

  @Prop({
    required: true,
    enum: OrderPriority,
    default: OrderPriority.NORMAL,
  })
  priority!: OrderPriority;

  @Prop({ required: false })
  customer_name?: string;

  @Prop({ required: false })
  customer_phone?: string;

  @Prop({ required: false })
  delivery_address?: string;

  @Prop({ required: false })
  courier_name?: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'ProductMongoModel',
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    default: [],
    _id: false,
  })
  items!: {
    product: Types.ObjectId;
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
    _id: false,
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

OrderMongoSchema.index({ source: 1, external_id: 1 }, { unique: true });
OrderMongoSchema.index({ status: 1, created_at: -1 });
OrderMongoSchema.index({ display_number: 1 });
