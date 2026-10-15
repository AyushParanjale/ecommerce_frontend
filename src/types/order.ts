export type OrderStatus = 'PendingPayment' | 'Confirmed' | 'PaymentFailed' | 'Cancelled';

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItemResponse[];
}
