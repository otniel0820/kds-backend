import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdersRepositoryPort, OrderFilter } from 'src/application/orders';
import { OrderEntity } from 'src/domain/orders';
import {
  OrderMongoModel,
  OrderMongoDocument,
} from '../schemas/order.mongo.schema';
import { buildOrderDetailPipeline } from '../piplines';
import { OrderPersistenceMapper } from '../mappers';
import { OrderDetailDto } from 'src/application/orders/dtos/order-details.dto';

export class OrdersMongoRepository implements OrdersRepositoryPort {
  constructor(
    @InjectModel(OrderMongoModel.name)
    private readonly model: Model<OrderMongoDocument>,
  ) {}

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? OrderPersistenceMapper.toDomain(doc) : null;
  }

  async findByFilter(filter: OrderFilter): Promise<OrderEntity[]> {
    const q: Record<string, unknown> = {};

    if (filter.id) q._id = filter.id;
    if (filter.source) q.source = filter.source;
    if (filter.externalId) q.externalId = filter.externalId;
    if (filter.status?.length) q.status = { $in: filter.status };

    const docs = await this.model.find(q).exec();
    return docs.map((d) => OrderPersistenceMapper.toDomain(d));
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    const displayNumber = await this.generateDisplayNumber();

    const persistence = OrderPersistenceMapper.toPersistence(
      order.withDisplayNumber(displayNumber),
    );

    const doc = await this.model.create(persistence);

    return OrderPersistenceMapper.toDomain(doc);
  }

  async update(order: OrderEntity): Promise<OrderEntity> {
    const persistence = OrderPersistenceMapper.toPersistence(order);

    const doc = await this.model
      .findByIdAndUpdate(order.id, { $set: persistence }, { new: true })
      .exec();

    return OrderPersistenceMapper.toDomain(doc!);
  }

  async findDetailProjection(id: string) {
    const result = await this.model.aggregate<OrderDetailDto>(
      buildOrderDetailPipeline(id),
    );

    return result[0] ?? null;
  }

  private async generateDisplayNumber(): Promise<string> {
    const last = await this.model
      .findOne({})
      .sort({ display_number: -1 })
      .lean()
      .exec();

    const next = last ? Number(last.display_number) + 1 : 1;

    return next.toString().padStart(4, '0');
  }
}
