import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderEntity } from 'src/domain/orders';
import {
  OrderMongoModel,
  OrderMongoDocument,
} from '../schemas/order.mongo.schema';
import { buildOrderDetailPipeline } from '../piplines';
import { OrderPersistenceMapper } from '../mappers';
import { OrderListLeanDoc } from '../types';
import { OrdersRepositoryPort, OrderFilter } from 'src/application/orders';
import { OrderDetailOutput } from 'src/application/orders/contracts/output/order-detail.output';
import { OrderSummary } from 'src/application/orders/contracts/output/order-symary.output';
import { OrderSummaryMapper } from '../mappers/order-sumary.mapper';

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
    const query = this.buildMongoQuery(filter);

    const docs = await this.model.find(query).exec();

    return docs.map((doc) => OrderPersistenceMapper.toDomain(doc));
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    const displayNumber = await this.generateDisplayNumber();

    order.updateDisplayNumber(displayNumber);

    const persistence = OrderPersistenceMapper.toPersistence(order);

    const doc = await this.model.create(persistence);

    return OrderPersistenceMapper.toDomain(doc);
  }

  async update(order: OrderEntity): Promise<OrderEntity> {
    const persistence = OrderPersistenceMapper.toPersistence(order);

    const doc = await this.model
      .findByIdAndUpdate(order.id, { $set: persistence }, { new: true })
      .exec();

    if (!doc) {
      throw new Error(`Order not found: ${order.id}`);
    }

    return OrderPersistenceMapper.toDomain(doc);
  }

  async findDetailProjection(id: string): Promise<OrderDetailOutput | null> {
    const result = await this.model.aggregate<OrderDetailOutput>(
      buildOrderDetailPipeline(id),
    );

    return result.length > 0 ? result[0] : null;
  }

  async findList(
    filter: OrderFilter,
  ): Promise<{ orders: OrderSummary[]; total: number }> {
    const query = this.buildMongoQuery(filter);

    const limit = filter.limit ?? 20;
    const skip = filter.skip ?? 0;

    const docs = await this.model
      .find(query)
      .populate<{ partner?: { name: string; image: string } }>({
        path: 'partner',
        select: 'name image',
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.model.countDocuments(query);

    const orders = docs.map((doc) =>
      OrderSummaryMapper.fromMongo(doc as OrderListLeanDoc),
    );

    return { orders, total };
  }

  async findItemUpdateById(id: string): Promise<OrderSummary> {
    const doc = await this.model
      .findById(id)
      .populate<{ partner?: { name: string; image: string } }>({
        path: 'partner',
        select: 'name image',
      })
      .lean()
      .exec();

    if (!doc) {
      throw new Error(`Order not found: ${id}`);
    }

    return OrderSummaryMapper.fromMongo(doc as OrderListLeanDoc);
  }

  private buildMongoQuery(filter: OrderFilter): Record<string, unknown> {
    const query: Record<string, unknown> = {};

    Object.assign(query, {
      ...(filter.id && { _id: filter.id }),
      ...(filter.source && { source: filter.source }),
      ...(filter.externalId && { external_id: filter.externalId }),
      ...(filter.status?.length && { status: { $in: filter.status } }),
      ...this.buildCreatedAt(filter),
    });

    return query;
  }

  private buildCreatedAt(filter: OrderFilter): Record<string, unknown> {
    if (!filter.createdFrom && !filter.createdTo) return {};

    return {
      created_at: {
        ...(filter.createdFrom && { $gte: filter.createdFrom }),
        ...(filter.createdTo && { $lte: filter.createdTo }),
      },
    };
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
