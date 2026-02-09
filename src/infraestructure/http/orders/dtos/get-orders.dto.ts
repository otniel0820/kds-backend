import { z } from 'zod';
import { OrderStatus } from 'src/domain/orders';

const toStringArray = (v: unknown) => {
  if (typeof v === 'string') {
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(v)) return v.map(String);
  return v;
};

export const GetOrdersDto = z
  .object({
    id: z.string().optional(),

    externalId: z.string().optional(),

    source: z.string().optional(),

    status: z
      .preprocess(toStringArray, z.array(z.nativeEnum(OrderStatus)))
      .optional(),

    createdFrom: z.coerce.date().optional(),

    createdTo: z.coerce.date().optional(),

    limit: z.coerce.number().min(1).max(100).default(20),

    skip: z.coerce.number().min(0).default(0),
  })
  .refine(
    (data) =>
      !data.createdFrom ||
      !data.createdTo ||
      data.createdFrom <= data.createdTo,
    {
      message: 'createdFrom must be before createdTo',
      path: ['createdFrom'],
    },
  );

export type IGetOrdersDto = z.infer<typeof GetOrdersDto>;
