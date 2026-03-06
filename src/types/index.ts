export type {
  Product,
  NewProduct,
  CartItem,
  NewCartItem,
  Order,
  NewOrder,
  OrderItem,
  User,
  NewUser,
  Category,
  NewCategory,
} from "@/lib/db/schema";

export interface CartItemWithProduct {
  id: number;
  sessionId: string;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    inventory: number;
  };
}

export interface CartSummary {
  items: CartItemWithProduct[];
  subtotal: number;
  itemCount: number;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface OrderItemWithProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
  } | null;
}

export interface OrderWithItems {
  id: number;
  sessionId: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  totalAmount: number;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemWithProduct[];
}
