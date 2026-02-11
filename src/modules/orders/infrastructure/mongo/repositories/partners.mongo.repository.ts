import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  PartnerMongoModel,
  PartnerMongoDocument,
} from '../schemas/partners.schema';
import {
  PartnersRepositoryPort,
  PartnerLookup,
} from 'src/modules/orders/application/ports/partners-repository.port';

export class PartnersMongoRepository implements PartnersRepositoryPort {
  constructor(
    @InjectModel(PartnerMongoModel.name)
    private readonly model: Model<PartnerMongoDocument>,
  ) {}

  async findBySlug(slug: string): Promise<PartnerLookup | null> {
    const doc = await this.model
      .findOne({ slug })
      .select('_id name image')
      .lean()
      .exec();

    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      image: doc.image as string,
    };
  }
}
