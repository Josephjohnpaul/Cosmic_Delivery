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
        image: "☕",
        description: "Freshly roasted coffee beans from Earth, delivered with temperature-controlled cosmic pods.",
        planet: "Mars",
        breakdown: {
          "Base Price": "₹500",
          "Space Bureaucracy Fee": "₹45,00,000",
          "Alien Customs Bribe": "₹67,00,000",
          "Rocket Fuel Surcharge": "₹89,50,000",
          "Cosmic Insurance (Coffee Spillage)": "₹33,99,500",
          "Asteroid Belt Navigation Tax": "₹12,00,000"
        },
        isExclusive: 0
      },
      {
        id: "2",
        name: "Gaming Laptop",
        price: "₹47,99,99,999",
        image: "💻",
        description: "High-performance gaming laptop with anti-cosmic ray shielding and zero-gravity cooling system.",
        planet: "Jupiter",
        breakdown: {
          "Base Price": "₹1,50,000",
          "Intergalactic WiFi Setup": "₹15,67,89,999",
          "Anti-Gravity Mouse Pad": "₹8,45,00,000",
          "Jupiter Storm Coverage": "₹12,34,60,000",
          "RGB Lighting Permit": "₹9,99,99,000",
          "Alien Gamer Registration": "₹1,52,00,000"
        },
        isExclusive: 0
      },
      {
        id: "3",
        name: "Margherita Pizza",
        price: "₹12,34,567",
        image: "🍕",
        description: "Fresh pizza kept warm during the journey with our patented cosmic oven technology.",
        planet: "Venus",
        breakdown: {
          "Base Price": "₹400",
          "Hot Planet Delivery Surcharge": "₹4,56,000",
          "Cheese Melting Prevention": "₹5,67,890",
          "Volcanic Ash Insurance": "₹1,23,456",
          "Toppings Import Tax": "₹87,821"
        },
        isExclusive: 0
      },
      {
        id: "4",
        name: "Indoor Plant",
        price: "₹89,76,543",
        image: "🪴",
        description: "Living plant with artificial atmosphere bubble and UV protection dome.",
        planet: "Saturn",
        breakdown: {
          "Base Price": "₹200",
          "Photosynthesis Permit": "₹34,56,000",
          "Ring-dodging Navigation": "₹23,45,678",
          "Oxygen Bubble Maintenance": "₹31,74,665"
        },
        isExclusive: 0
      },
      {
        id: "5",
        name: "Smartphone",
        price: "₹15,67,89,012",
        image: "📱",
        description: "Latest smartphone with cosmic signal booster and meteor-proof case.",
        planet: "Neptune",
        breakdown: {
          "Base Price": "₹80,000",
          "Interplanetary Roaming": "₹7,89,12,345",
          "Cosmic Signal Amplifier": "₹4,56,78,901",
          "Frozen Moon Protection": "₹2,34,56,789",
          "Ice Crack Screen Insurance": "₹87,60,977"
        },
        isExclusive: 0
      },
      {
        id: "6",
        name: "Chocolate Bar",
        price: "₹3,45,678",
        image: "🍫",
        description: "Delicious chocolate bar with anti-melting nano-coating for space travel.",
        planet: "Mars",
        breakdown: {
          "Base Price": "₹50",
          "Cocoa Bean Import License": "₹1,23,456",
          "Anti-Melting Technology": "₹87,654",
          "Red Planet Landing Fee": "₹1,34,518"
        },
        isExclusive: 0
      },
      {
        id: "7",
        name: "Running Shoes",
        price: "₹23,45,67,890",
        image: "👟",
        description: "Athletic shoes with anti-gravity soles and magnetic grip technology.",
        planet: "Jupiter",
        breakdown: {
          "Base Price": "₹5,000",
          "Anti-Gravity Sole Technology": "₹12,34,56,789",
          "Magnetic Grip Installation": "₹6,78,90,123",
          "Jupiter Pressure Testing": "₹4,32,15,978"
        },
        isExclusive: 0
      },
      {
        id: "8",
        name: "Sunglasses",
        price: "₹8,76,54,321",
        image: "🕶️",
        description: "Designer sunglasses with cosmic UV protection and solar flare filters.",
        planet: "Venus",
        breakdown: {
          "Base Price": "₹2,500",
          "Solar Flare Filtering": "₹4,32,10,987",
          "Fashion Police Permit": "₹3,21,09,876",
          "Cool Factor Insurance": "₹1,23,30,958"
        },
        isExclusive: 0
      },
      {
        id: "9",
        name: "Wireless Headphones",
        price: "₹8,99,99,999",
        image: "🎧",
        description: "Noise-cancelling headphones that can block out rocket engines and alien screams.",
        planet: "Mars",
        breakdown: {
          "Base Price": "₹12,000",
          "Silence License Fee": "₹3,45,67,890",
          "Alien Scream Filtering": "₹2,67,89,123",
          "Rocket Engine Noise Blocker": "₹2,84,42,986"
        },
        isExclusive: 0
      },
      {
        id: "10",
        name: "Electric Toothbrush",
        price: "₹45,67,890",
        image: "🪥",
        description: "Rechargeable toothbrush with cosmic plaque removal and space-grade bristles.",
        planet: "Saturn",
        breakdown: {
          "Base Price": "₹3,500",
          "Space Dentist Approval": "₹15,64,390",
          "Cosmic Plaque Research": "₹12,00,000",
          "Ring Particle Removal": "₹18,00,000"
        },
        isExclusive: 0
      },
      {
        id: "11",
        name: "Yoga Mat",
        price: "₹23,45,678",
        image: "🧘",
        description: "Anti-slip yoga mat designed for zero-gravity meditation sessions.",
        planet: "Neptune",
        breakdown: {
          "Base Price": "₹2,000",
          "Zero-G Certification": "₹8,43,678",
          "Meditation License": "₹6,00,000",
          "Spiritual Alignment Fee": "₹9,00,000"
        },
        isExclusive: 0
      },
      {
        id: "12",
        name: "Water Bottle",
        price: "₹12,34,567",
        image: "🍼",
        description: "Insulated water bottle that prevents water from floating away in zero gravity.",
        planet: "Venus",
        breakdown: {
          "Base Price": "₹800",
          "Anti-Gravity Liquid Lock": "₹4,33,767",
          "Heat Resistant Coating": "₹3,00,000",
          "Hydration Permit": "₹5,00,000"
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
