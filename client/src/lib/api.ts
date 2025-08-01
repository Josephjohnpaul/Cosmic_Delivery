import { type Product, type CartItem } from "@shared/schema";
import { storage } from "../services/storage";
import { generateCosmicPrice } from "../services/openai";

// Simulate API responses for client-side only architecture
export class ClientAPI {
  static async getProducts(): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return storage.getProducts();
  }

  static async getExclusiveProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return storage.getExclusiveProducts();
  }

  static async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return storage.getCartItems(sessionId);
  }

  static async addToCart(cartItem: Omit<CartItem, 'id'>): Promise<CartItem> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const fullCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      ...cartItem
    };
    
    storage.addToCart(fullCartItem);
    return fullCartItem;
  }

  static async addVirtualToCart(virtualProduct: Product, sessionId: string): Promise<CartItem> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    storage.addVirtualToCart(virtualProduct, sessionId);
    
    return {
      id: `virtual-${Date.now()}`,
      sessionId,
      productId: virtualProduct.id
    };
  }

  static async removeFromCart(sessionId: string, productId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    storage.removeFromCart(sessionId, productId);
  }

  static async clearCart(sessionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    storage.clearCart(sessionId);
  }

  static async searchProduct(item: string, planet: string, agency?: string): Promise<Product> {
    // Generate cosmic pricing
    const pricing = await generateCosmicPrice(item, planet, agency);
    
    // Create virtual product
    const virtualProduct: Product = {
      id: `virtual-${Date.now()}-${Math.random()}`,
      name: item,
      price: pricing.price,
      image: this.getItemEmoji(item),
      description: `${item} specially prepared for delivery to ${planet}. Guaranteed cosmic quality!`,
      planet,
      breakdown: pricing.breakdown,
      isExclusive: 0
    };

    return virtualProduct;
  }

  private static getItemEmoji(item: string): string {
    const itemLower = item.toLowerCase();
    
    if (itemLower.includes('coffee')) return '☕';
    if (itemLower.includes('pizza')) return '🍕';
    if (itemLower.includes('laptop') || itemLower.includes('computer')) return '💻';
    if (itemLower.includes('phone') || itemLower.includes('iphone')) return '📱';
    if (itemLower.includes('car')) return '🚗';
    if (itemLower.includes('book')) return '📚';
    if (itemLower.includes('watch')) return '⌚';
    if (itemLower.includes('shoes')) return '👟';
    if (itemLower.includes('tv') || itemLower.includes('television')) return '📺';
    if (itemLower.includes('game')) return '🎮';
    if (itemLower.includes('music')) return '🎵';
    if (itemLower.includes('camera')) return '📷';
    if (itemLower.includes('food')) return '🍽️';
    if (itemLower.includes('drink')) return '🥤';
    
    return '📦'; // Default package emoji
  }
}