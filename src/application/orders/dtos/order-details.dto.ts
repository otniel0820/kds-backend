export type OrderDetailDto = {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
  courierName?: string;

  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    currency: string;
    qty: number;
  }[];
};
