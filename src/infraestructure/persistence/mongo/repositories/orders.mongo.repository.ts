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
import { OrderListDto } from 'src/application/orders/dtos';
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
    if (filter.externalId) q.external_id = filter.externalId;
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

  async findList(
    filter: OrderFilter,
  ): Promise<{ orders: OrderListDto[]; total: number }> {
    const q: Record<string, any> = {};

    if (filter.id) q._id = filter.id;
    if (filter.source) q.source = filter.source;
    if (filter.externalId) q.external_id = filter.externalId;

    if (filter.status?.length) {
      q.status = { $in: filter.status };
    }
    if (filter.createdFrom || filter.createdTo) {
      q.created_at = {};

      if (filter.createdFrom) {
        q.created_at.$gte = filter.createdFrom;
      }

      if (filter.createdTo) {
        q.created_at.$lte = filter.createdTo;
      }
    }

    const limit = filter.limit ?? 20;
    const skip = filter.skip ?? 0;

    const docs = (await this.model
      .find(q)
      .populate<{ partner?: { name: string; image: string } }>({
        path: 'partner',
        select: 'name image',
      })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()) as OrderListLeanDoc[];

    const total = await this.model.countDocuments(q);

    const data: OrderListDto[] = docs.map((doc) => ({
      id: doc._id.toString(),
      partnerName: doc.partner?.name,
      partnerImage: doc.partner?.image,
      displayNumber: doc.display_number,
      status: doc.status,
      priority: doc.priority,
      activeTimer: this.resolveActiveTimerFromMongo(doc.status, doc.timers),
      courierName: doc.courier_name ?? undefined,
    }));

    return { orders: data, total };
  }
  async findItemUpdateById(id: string): Promise<OrderListDto> {
    const doc = await this.model
      .findById(id)
      .populate<{ partner?: { name: string; image: string } }>({
        path: 'partner',
        select: 'name image',
      })
      .lean()
      .exec();

    return {
      id: doc!._id.toString(),
      partnerName: doc!.partner?.name,
      partnerImage: doc!.partner?.image,
      displayNumber: doc!.display_number,
      status: doc!.status,
      priority: doc!.priority,
      activeTimer: this.resolveActiveTimerFromMongo(doc!.status, doc!.timers),
      courierName: doc!.courier_name ?? undefined,
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

  private resolveActiveTimerFromMongo(
    status: string,
    timers?: Record<string, unknown>,
  ): string | undefined {
    if (!timers) return undefined;

    const statusTimerMap: Record<string, string> = {
      RECEIVED: 'placed_at',
      CONFIRMED: 'confirmed_at',
      PREPARING: 'preparing_at',
      READY: 'ready_at',
      PICKED_UP: 'picked_up_at',
      DELIVERED: 'delivered_at',
      CANCELLED: 'cancelled_at',
    };

    const key = statusTimerMap[status];
    if (!key) return undefined;

    const rawValue = timers[key];
    if (!rawValue) return undefined;

    const date =
      rawValue instanceof Date ? rawValue : new Date(rawValue as string);

    return isNaN(date.getTime()) ? undefined : date.toISOString();
  }
}
