import { OrderEntity } from 'src/domain/orders';
import { OrderPriority } from 'src/domain/orders/value-objects';
import { OrderMongoDocument } from '../schemas/order.mongo.schema';

export class OrderPersistenceMapper {
  static toPersistence(order: OrderEntity) {
    const p = order.toPrimitives();

    return {
      source: p.source,
      external_id: p.externalId,
      display_number: p.displayNumber,
      priority: p.priority,
      customer_name: p.customerName,
      customer_phone: p.customerPhone,
      delivery_address: p.deliveryAddress,
      courier_name: p.courierName,
      notes: p.notes,
      status: p.status,
      items: p.items,
      timers: {
        placed_at: p.timers.placedAt,
        confirmed_at: p.timers.confirmedAt,
        preparing_at: p.timers.preparingAt,
        ready_at: p.timers.readyAt,
        picked_up_at: p.timers.pickedUpAt,
        delivered_at: p.timers.deliveredAt,
        cancelled_at: p.timers.cancelledAt,
      },
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    };
  }

  static toDomain(doc: OrderMongoDocument): OrderEntity {
    return new OrderEntity({
      id: String(doc._id),
      source: doc.source,
      externalId: doc.external_id,
      displayNumber: doc.display_number,
      priority: doc.priority ?? OrderPriority.NORMAL,
      customerName: doc.customer_name,
      customerPhone: doc.customer_phone,
      deliveryAddress: doc.delivery_address,
      courierName: doc.courier_name,
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
}
