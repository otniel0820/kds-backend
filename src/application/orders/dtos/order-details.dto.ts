export type OrderDetailDto = {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
  courierName?: string;

  items: {
    sku: string;
    name: string;
    qty: number;
  }[];
};
