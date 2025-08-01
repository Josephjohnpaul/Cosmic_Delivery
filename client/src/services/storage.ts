import { type Product, type CartItem } from "@shared/schema";
import { allProducts, defaultProducts, exclusiveProducts } from "../data/products";

// Client-side storage using localStorage
export class ClientStorage {
  private static instance: ClientStorage;
  private cartKey = "cosmic-delivery-cart";

  static getInstance(): ClientStorage {
    if (!ClientStorage.instance) {
      ClientStorage.instance = new ClientStorage();
    }
    return ClientStorage.instance;
  }

  // Products
  getProducts(): Product[] {
    return defaultProducts;
  }

  getExclusiveProducts(): Product[] {
    return exclusiveProducts;
  }

  getAllProducts(): Product[] {
    return allProducts;
  }

  getProduct(id: string): Product | undefined {
    return allProducts.find(p => p.id === id);
  }

  // Cart management
  getCartItems(sessionId: string): (CartItem & { product: Product })[] {
    const cartData = localStorage.getItem(`${this.cartKey}-${sessionId}`);
    if (!cartData) return [];

    const cartItems: CartItem[] = JSON.parse(cartData);
    return cartItems.map(item => {
      const product = this.getProduct(item.productId) || this.getVirtualProduct(item.productId);
      return { ...item, product };
    }).filter(item => item.product) as (CartItem & { product: Product })[];
  }

  addToCart(cartItem: CartItem): void {
    const existingCart = this.getCartItems(cartItem.sessionId);
    const existingItemIndex = existingCart.findIndex(item => item.productId === cartItem.productId);

    let updatedCart: CartItem[];
    if (existingItemIndex >= 0) {
      updatedCart = existingCart.map((item, index) => 
        index === existingItemIndex 
          ? { ...item }
          : item
      );
    } else {
      updatedCart = [...existingCart, cartItem];
    }

    localStorage.setItem(`${this.cartKey}-${cartItem.sessionId}`, JSON.stringify(updatedCart));
  }

  addVirtualToCart(virtualProduct: Product, sessionId: string): void {
    // Store virtual product temporarily
    this.storeVirtualProduct(virtualProduct);
    
    const cartItem: CartItem = {
      id: `virtual-${Date.now()}`,
      sessionId,
      productId: virtualProduct.id
    };

    this.addToCart(cartItem);
  }

  removeFromCart(sessionId: string, productId: string): void {
    const existingCart = this.getCartItems(sessionId);
    const updatedCart = existingCart.filter(item => item.productId !== productId);
    localStorage.setItem(`${this.cartKey}-${sessionId}`, JSON.stringify(updatedCart));
  }

  clearCart(sessionId: string): void {
    localStorage.removeItem(`${this.cartKey}-${sessionId}`);
  }

  // Virtual products (from search)
  private getVirtualProductsKey() {
    return "cosmic-delivery-virtual-products";
  }

  private storeVirtualProduct(product: Product): void {
    const virtualProducts = this.getVirtualProducts();
    virtualProducts[product.id] = product;
    localStorage.setItem(this.getVirtualProductsKey(), JSON.stringify(virtualProducts));
  }

  private getVirtualProducts(): Record<string, Product> {
    const data = localStorage.getItem(this.getVirtualProductsKey());
    return data ? JSON.parse(data) : {};
  }

  private getVirtualProduct(id: string): Product | undefined {
    const virtualProducts = this.getVirtualProducts();
    return virtualProducts[id];
  }

  // Session management
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random()}`;
  }

  getSessionId(): string {
    const stored = localStorage.getItem("cosmic-delivery-session");
    if (stored) return stored;
    
    const newSession = this.generateSessionId();
    localStorage.setItem("cosmic-delivery-session", newSession);
    return newSession;
  }
}

export const storage = ClientStorage.getInstance();