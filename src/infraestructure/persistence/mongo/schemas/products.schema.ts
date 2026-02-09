import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProductType } from 'src/domain/orders/value-objects/product-type.vo';

export type ProductMongoDocument = HydratedDocument<ProductMongoModel> & {
  created_at: Date;
  updated_at: Date;
};

@Schema({
  collection: 'products',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class ProductMongoModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true, default: 'EUR' })
  currency!: string;

  @Prop({
    required: true,
    enum: ProductType,
  })
  type!: ProductType;

  @Prop({ default: true })
  is_active!: boolean;
}

export const ProductMongoSchema =
  SchemaFactory.createForClass(ProductMongoModel);

ProductMongoSchema.index({ type: 1 });
ProductMongoSchema.index({ is_active: 1 });
