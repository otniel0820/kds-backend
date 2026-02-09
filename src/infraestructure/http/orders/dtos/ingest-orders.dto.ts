import { z } from 'zod';
import { OrderPriority } from 'src/domain/orders/value-objects/order-priority.vo';

export const IngestOrderDto = z.object({
  source: z.string().min(1),
  externalId: z.string().min(1),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  deliveryAddress: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
  priority: z.nativeEnum(OrderPriority).optional(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().positive(),
      }),
    )
    .min(1),
});

export type IIngestOrderDto = z.infer<typeof IngestOrderDto>;
