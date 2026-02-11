import { OrderStatusValue } from 'src/modules/orders/domain';

export type ListOrdersInput = {
  id?: string;
  source?: string;
  externalId?: string;
  status?: OrderStatusValue[];
  limit?: number;
  skip?: number;
};
