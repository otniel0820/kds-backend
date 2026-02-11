export type OrderDetailOutput = {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
  courierName?: string;

  items: OrderDetailItem[];
};

export type OrderDetailItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  qty: number;
};
