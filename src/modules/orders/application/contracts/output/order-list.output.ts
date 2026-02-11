export type OrderListItemOutput = {
  id: string;
  partnerName?: string;
  partnerImage?: string;
  displayNumber: string;
  status: string;
  priority: string;
  activeTimer?: string;
  courierName?: string;
};

export type ListOrdersOutput = {
  orders: OrderListItemOutput[];
  total: number;
};
