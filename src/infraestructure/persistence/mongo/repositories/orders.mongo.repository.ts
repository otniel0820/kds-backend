import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import { OrdersRepositoryPort, OrderFilter } from 'src/application/orders';

import { OrderEntity } from 'src/domain/orders';

import {
  OrderMongoModel,
  OrderMongoDocument,
} from '../schemas/order.mongo.schema';
import { OrderPriority } from 'src/domain/orders/value-objects';

export class OrdersMongoRepository implements OrdersRepositoryPort {
  constructor(
    @InjectModel(OrderMongoModel.name)
    private readonly model: Model<OrderMongoDocument>,
  ) {}

  private toDomain(doc: OrderMongoDocument): OrderEntity {
    return new OrderEntity({
      id: String(doc._id),
      source: doc.source,
      externalId: doc.externalId,
      displayNumber: doc.displayNumber,
      priority: doc.priority ?? OrderPriority.NORMAL,
      customerName: doc.customerName,
      customerPhone: doc.customerPhone,
      deliveryAddress: doc.deliveryAddress,
      courierName: doc.courierName,
      notes: doc.notes,
      status: doc.status,
      items: doc.items ?? [],
      timers: {
        placedAt: doc.timers?.placed_at,
        confirmedAt: doc.timers?.confirmed_at,
        preparingAt: doc.timers?.preparing_at,
        readyAt: doc.timers?.ready_at,
        pickedUpAt: doc.timers?.picked_up_at,
        deliveredAt: doc.timers?.delivered_at,
        cancelledAt: doc.timers?.cancelled_at,
      },
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    });
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByFilter(filter: OrderFilter): Promise<OrderEntity[]> {
    const q: Record<string, unknown> = {};

    if (filter.id) q._id = filter.id;
    if (filter.source) q.source = filter.source;
    if (filter.externalId) q.externalId = filter.externalId;
    if (filter.status?.length) q.status = { $in: filter.status };

    const docs = await this.model.find(q).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    const p = order.toPrimitives();

    const displayNumber = await this.generateDisplayNumber();

    const doc = await this.model.create({
      ...p,
      displayNumber,
      timers: {
        placed_at: p.timers.placedAt,
      },
    });

    return this.toDomain(doc);
  }

  async update(order: OrderEntity): Promise<OrderEntity> {
    const p = order.toPrimitives();

    const updatePayload: Record<string, unknown> = {
      status: p.status,
      updated_at: p.updatedAt,
      courierName: p.courierName,
    };

    for (const [key, value] of Object.entries(p.timers)) {
      if (!value) continue;

      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );

      updatePayload[`timers.${snakeKey}`] = value;
    }
    const doc = await this.model
      .findByIdAndUpdate(p.id, { $set: updatePayload }, { new: true })
      .exec();
    return this.toDomain(doc!);
  }

  async aggregate<T = unknown>(pipeline: PipelineStage[]): Promise<T[]> {
    return this.model.aggregate<T>(pipeline).exec();
  }

  private async generateDisplayNumber(): Promise<string> {
    const last = await this.model
      .findOne({})
      .sort({ displayNumber: -1 })
      .lean()
      .exec();

    const next = last ? Number(last.displayNumber) + 1 : 1;

    return next.toString().padStart(4, '0');
  }
}
