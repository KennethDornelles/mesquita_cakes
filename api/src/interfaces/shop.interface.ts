export interface CartItemData {
  productId: string;
  quantity: number;
  priceSnapshot?: number;
}

export interface OrderData {
  userId: string;
  addressId: string;
  items: OrderItemData[];
  paymentMethod: string;
  deliveryDate?: Date;
  notes?: string;
}

export interface OrderItemData {
  productId: string;
  quantity: number;
  price: number;
}

export interface AddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}
