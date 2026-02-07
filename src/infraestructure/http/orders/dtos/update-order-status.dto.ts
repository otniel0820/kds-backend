import { z } from 'zod';
import { OrderStatus } from 'src/domain/orders';

export const UpdateOrderStatusDto = z.object({
  toStatus: z.nativeEnum(OrderStatus),
});

export type IUpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusDto>;
