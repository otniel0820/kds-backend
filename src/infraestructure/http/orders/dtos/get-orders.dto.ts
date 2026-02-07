import { z } from 'zod';
import { OrderStatus } from 'src/domain/orders';

const toStringArray = (v: unknown) => {
  if (typeof v === 'string')
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  if (Array.isArray(v)) return v.map(String);
  return v;
};

const ById = z.object({
  id: z.string(),
  externalId: z.undefined().optional(),
  source: z.undefined().optional(),
  status: z.undefined().optional(),
});

const ByExternal = z.object({
  id: z.undefined().optional(),
  externalId: z.string(),
  source: z.string(),
  status: z.undefined().optional(),
});

const ByStatus = z.object({
  id: z.undefined().optional(),
  externalId: z.undefined().optional(),
  source: z.undefined().optional(),
  status: z.preprocess(toStringArray, z.array(z.nativeEnum(OrderStatus))),
});

export const GetOrdersDto = z.union([ById, ByExternal, ByStatus]);
export type IGetOrdersDto = z.infer<typeof GetOrdersDto>;
