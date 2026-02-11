import { z } from 'zod';
import { ORDER_PRIORITY_VALUES } from '../constants/order-http.constants';

export const IngestOrderDto = z.object({
  source: z.string().min(1),
  externalId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  deliveryAddress: z.string().min(1),
  notes: z.string().min(1).optional(),
  priority: z.enum(ORDER_PRIORITY_VALUES).optional(),
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
