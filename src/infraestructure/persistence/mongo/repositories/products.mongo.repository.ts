import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProductMongoModel,
  ProductMongoDocument,
} from '../schemas/products.schema';
import { ProductsRepositoryPort } from 'src/application/orders/ports/products-repository.port';

export class ProductsMongoRepository implements ProductsRepositoryPort {
  constructor(
    @InjectModel(ProductMongoModel.name)
    private readonly model: Model<ProductMongoDocument>,
  ) {}

  async findBySlugs(slugs: string[]) {
    const docs = await this.model
      .find({ slug: { $in: slugs } })
      .select('_id slug')
      .lean()
      .exec();

    return docs.map((d) => ({
      id: d._id.toString(),
      slug: d.slug,
    }));
  }
}
