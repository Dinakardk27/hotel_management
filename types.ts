// Data Models

// Changed from Enum to string to allow dynamic categories (e.g. Biryani, Tandoori)
export type Category = string;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedUnit: string; // e.g., "250g", "1kg", "2 Scoops", "500ml"
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  paymentMethod: 'Card' | 'Cash' | 'UPI';
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}
