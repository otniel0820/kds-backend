import { z } from 'zod';

import { ORDER_STATUS_VALUES } from '../constants/order-http.constants';

export const UpdateOrderStatusDto = z.object({
  toStatus: z.enum(ORDER_STATUS_VALUES),
});

export type IUpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusDto>;
