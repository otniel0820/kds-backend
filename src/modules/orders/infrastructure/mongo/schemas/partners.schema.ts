import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PartnerMongoDocument = HydratedDocument<PartnerMongoModel> & {
  created_at: Date;
  updated_at: Date;
};

@Schema({
  collection: 'partners',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class PartnerMongoModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: true })
  external_id!: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ default: true })
  is_active!: boolean;
}

export const PartnerMongoSchema =
  SchemaFactory.createForClass(PartnerMongoModel);

PartnerMongoSchema.index({ external_id: 1 });
