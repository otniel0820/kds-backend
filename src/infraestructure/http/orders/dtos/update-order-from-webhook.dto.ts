import { z } from 'zod';

const WebhookAllowedStatuses = ['PICKED_UP', 'DELIVERED', 'CANCELLED'] as const;

export const UpdateOrderWebhookDto = z.object({
  source: z.string().min(1),
  externalId: z.string().min(1),
  toStatus: z.enum(WebhookAllowedStatuses),
});

export type IUpdateOrderWebhookDto = z.infer<typeof UpdateOrderWebhookDto>;
