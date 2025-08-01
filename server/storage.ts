import { type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getExclusiveProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  removeFromCart(sessionId: string, productId: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const defaultProducts: Product[] = [
      {
        id: "1",
        name: "Premium Coffee Beans",
        price: "₹2,47,50,000",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Freshly roasted coffee beans from Earth, delivered with temperature-controlled cosmic pods.",
        planet: "Mars",
        breakdown: {
          "Base Price": "₹500",
          "Interplanetary Shipping": "₹89,50,000",
          "Radiation Insurance": "₹45,00,000",
          "Oxygen Container": "₹67,00,000",
          "Cosmic Taxes": "₹33,99,500",
          "Asteroid Dodge Fee": "₹12,00,000"
        },
        isExclusive: 0
      },
      {
        id: "2",
        name: "Gaming Laptop",
        price: "₹47,99,99,999",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "High-performance gaming laptop with anti-cosmic ray shielding and zero-gravity cooling system.",
        planet: "Jupiter",
        breakdown: {
          "Base Price": "₹1,50,000",
          "Gravitational Shipping": "₹15,67,89,999",
          "EMP Protection": "₹8,45,00,000",
          "Pressure Chamber": "₹12,34,60,000",
          "Jupiter Storm Insurance": "₹9,99,99,000",
          "Customs & Bribes": "₹1,52,00,000"
        },
        isExclusive: 0
      },
      {
        id: "3",
        name: "Margherita Pizza",
        price: "₹12,34,567",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Fresh pizza kept warm during the journey with our patented cosmic oven technology.",
        planet: "Venus",
        breakdown: {
          "Base Price": "₹400",
          "Thermal Protection": "₹4,56,000",
          "Speed Delivery": "₹5,67,890",
          "Acid Rain Cover": "₹1,23,456",
          "Hot Surface Landing": "₹87,821"
        },
        isExclusive: 0
      },
      {
        id: "4",
        name: "Indoor Plant",
        price: "₹89,76,543",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Living plant with artificial atmosphere bubble and UV protection dome.",
        planet: "Saturn",
        breakdown: {
          "Base Price": "₹200",
          "Life Support System": "₹34,56,000",
          "Ring Navigation": "₹23,45,678",
          "Atmospheric Bubble": "₹31,74,665"
        },
        isExclusive: 0
      },
      {
        id: "5",
        name: "Smartphone",
        price: "₹15,67,89,012",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Latest smartphone with cosmic signal booster and meteor-proof case.",
        planet: "Neptune",
        breakdown: {
          "Base Price": "₹80,000",
          "Deep Space Shipping": "₹7,89,12,345",
          "Signal Amplifier": "₹4,56,78,901",
          "Cosmic Radiation Shield": "₹2,34,56,789",
          "Ice Moon Landing Fee": "₹87,60,977"
        },
        isExclusive: 0
      },
      {
        id: "6",
        name: "Chocolate Bar",
        price: "₹3,45,678",
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Delicious chocolate bar with anti-melting nano-coating for space travel.",
        planet: "Mars",
        breakdown: {
          "Base Price": "₹50",
          "Temperature Control": "₹1,23,456",
          "Space Packaging": "₹87,654",
          "Martian Customs": "₹1,34,518"
        },
        isExclusive: 0
      },
      {
        id: "7",
        name: "Running Shoes",
        price: "₹23,45,67,890",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Athletic shoes with anti-gravity soles and magnetic grip technology.",
        planet: "Jupiter",
        breakdown: {
          "Base Price": "₹5,000",
          "Gravity Adjustment Tech": "₹12,34,56,789",
          "Magnetic Sole Installation": "₹6,78,90,123",
          "Zero-G Testing": "₹4,32,15,978"
        },
        isExclusive: 0
      },
      {
        id: "8",
        name: "Sunglasses",
        price: "₹8,76,54,321",
        image: "https://images.unsplash.com/photo-1473167504372-f22d7b62c222?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Designer sunglasses with cosmic UV protection and solar flare filters.",
        planet: "Venus",
        breakdown: {
          "Base Price": "₹2,500",
          "Solar Flare Protection": "₹4,32,10,987",
          "Cosmic UV Filters": "₹3,21,09,876",
          "Style Insurance": "₹1,23,30,958"
        },
        isExclusive: 0
      }
    ];

    const exclusiveProducts: Product[] = [
      {
        id: "101",
        name: "Martian Rock Candy",
        price: "₹12,345",
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Sweet crystalline candy made from actual Martian minerals. Tastes like iron with a hint of adventure!",
        planet: "Mars",
        breakdown: {
          "Local Mining": "₹8,000",
          "Crystallization Process": "₹3,000",
          "Martian Labor": "₹1,000",
          "Local Taxes": "₹345"
        },
        isExclusive: 1
      },
      {
        id: "102",
        name: "Floating Jupiter Balloon",
        price: "₹45,678",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Helium balloon that perpetually floats in Jupiter's atmosphere. Great for atmospheric parties!",
        planet: "Jupiter",
        breakdown: {
          "Gas Extraction": "₹25,000",
          "Atmospheric Processing": "₹15,000",
          "Storm Resistance Coating": "₹5,000",
          "Local Assembly": "₹678"
        },
        isExclusive: 1
      },
      {
        id: "103",
        name: "Venus Heat Pack",
        price: "₹23,456",
        image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1debc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Portable heating device powered by Venus's natural volcanic energy. Stays warm for 500 Earth years!",
        planet: "Venus",
        breakdown: {
          "Volcanic Energy Capture": "₹18,000",
          "Heat Containment Tech": "₹4,000",
          "Safety Certification": "₹1,000",
          "Local Shipping": "₹456"
        },
        isExclusive: 1
      },
      {
        id: "104",
        name: "Saturn Ring Fragment",
        price: "₹67,890",
        image: "https://images.unsplash.com/photo-1567473030492-533b30c5494c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Authentic piece of Saturn's rings encased in a display dome. A true cosmic collector's item!",
        planet: "Saturn",
        breakdown: {
          "Ring Collection": "₹50,000",
          "Preservation Chamber": "₹12,000",
          "Authentication Certificate": "₹5,000",
          "Display Case": "₹890"
        },
        isExclusive: 1
      },
      {
        id: "105",
        name: "Neptune Ice Cube Tray",
        price: "₹34,567",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Ice cube tray that creates perfect cubes using Neptune's frozen methane. Never melts!",
        planet: "Neptune",
        breakdown: {
          "Methane Collection": "₹20,000",
          "Freezing Technology": "₹10,000",
          "Perpetual Cold System": "₹4,000",
          "Manufacturing": "₹567"
        },
        isExclusive: 1
      },
      {
        id: "106",
        name: "Cosmic Dust Jar",
        price: "₹9,876",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Jar filled with genuine cosmic dust from the outer reaches of the solar system. Sparkles beautifully!",
        planet: "Mars",
        breakdown: {
          "Space Dust Collection": "₹6,000",
          "Purification Process": "₹2,500",
          "Sparkle Enhancement": "₹1,000",
          "Sealing & Packaging": "₹376"
        },
        isExclusive: 1
      }
    ];

    [...defaultProducts, ...exclusiveProducts].forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isExclusive === 0);
  }

  async getExclusiveProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isExclusive === 1);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      isExclusive: insertProduct.isExclusive ?? 0
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { ...cartItem, id };
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<void> {
    for (const [id, item] of Array.from(this.cartItems.entries())) {
      if (item.sessionId === sessionId && item.productId === productId) {
        this.cartItems.delete(id);
        break;
      }
    }
  }

  async clearCart(sessionId: string): Promise<void> {
    for (const [id, item] of Array.from(this.cartItems.entries())) {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(id);
      }
    }
  }
}

export const storage = new MemStorage();
