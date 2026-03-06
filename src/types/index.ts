export type { Product, NewProduct, CartItem, NewCartItem, Order, NewOrder, OrderItem } from "@/lib/db/schema";

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
