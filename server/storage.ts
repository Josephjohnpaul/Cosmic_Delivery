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
      // Mars Exclusives
      {
        id: "101",
        name: "Martian Rock Candy",
        price: "₹12,345",
        image: "🍭",
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
        name: "Red Dust Souvenir Jar",
        price: "₹9,876",
        image: "🏺",
        description: "Authentic Martian red dust in a decorative jar. Perfect for your Earth garden!",
        planet: "Mars",
        breakdown: {
          "Dust Collection": "₹6,000",
          "Quality Testing": "₹2,500",
          "Jar Manufacturing": "₹1,000",
          "Martian Export License": "₹376"
        },
        isExclusive: 1
      },
      {
        id: "103",
        name: "Rust-Flavored Water",
        price: "₹15,432",
        image: "🧪",
        description: "Naturally oxidized water with that authentic Mars taste. Rich in iron!",
        planet: "Mars",
        breakdown: {
          "Water Extraction": "₹10,000",
          "Rust Flavoring": "₹3,432",
          "Health Inspection": "₹1,500",
          "Bottle Deposit": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "104",
        name: "Mini Dust Storm Generator",
        price: "₹56,789",
        image: "🌪️",
        description: "Create your own mini dust storms at home with this Martian weather device!",
        planet: "Mars",
        breakdown: {
          "Storm Technology": "₹45,000",
          "Safety Features": "₹8,789",
          "Weather Permit": "₹2,500",
          "Assembly Instructions": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "105",
        name: "Olympus Mons Snow Globe",
        price: "₹23,456",
        image: "🏔️",
        description: "Beautiful snow globe featuring Mars' tallest volcano. Shake for dust storms!",
        planet: "Mars",
        breakdown: {
          "Miniature Volcano": "₹18,000",
          "Globe Manufacturing": "₹3,456",
          "Dust Storm Effects": "₹1,500",
          "Gift Wrapping": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "106",
        name: "Martian Sunset Paint Set",
        price: "₹18,765",
        image: "🎨",
        description: "Paint set with colors inspired by Mars' famous blue sunsets. Earth artists love it!",
        planet: "Mars",
        breakdown: {
          "Color Extraction": "₹12,000",
          "Paint Manufacturing": "₹4,765",
          "Artist License": "₹1,500",
          "Brush Set": "₹500"
        },
        isExclusive: 1
      },
      
      // Venus Exclusives
      {
        id: "107",
        name: "Venus Heat Pack",
        price: "₹23,456",
        image: "🔥",
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
        id: "108",
        name: "Acid Rain Umbrella",
        price: "₹34,567",
        image: "☂️",
        description: "Specially designed umbrella that can withstand Venus's corrosive acid rain. Fashion meets function!",
        planet: "Venus",
        breakdown: {
          "Acid-Proof Material": "₹25,000",
          "Umbrella Assembly": "₹6,567",
          "Corrosion Testing": "₹2,500",
          "Style Consulting": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "109",
        name: "Sulfuric Cloud Perfume",
        price: "₹45,678",
        image: "🌫️",
        description: "Eau de Venus - a unique fragrance capturing the essence of sulfuric clouds. Very exclusive!",
        planet: "Venus",
        breakdown: {
          "Cloud Essence Extraction": "₹35,000",
          "Perfume Manufacturing": "₹7,678",
          "Smell Testing": "₹2,500",
          "Fancy Bottle": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "110",
        name: "Pressure Cooker (Venus Edition)",
        price: "₹29,876",
        image: "🍲",
        description: "Cook at Venus atmospheric pressure! Your food will be ready in negative time!",
        planet: "Venus",
        breakdown: {
          "Pressure Technology": "₹22,000",
          "Safety Features": "₹5,876",
          "Recipe Book": "₹1,500",
          "Warranty": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "111",
        name: "Greenhouse Gas Sampler",
        price: "₹37,654",
        image: "💨",
        description: "Collect and study Venus's famous greenhouse gases. Educational and terrifying!",
        planet: "Venus",
        breakdown: {
          "Gas Collection Kit": "₹28,000",
          "Analysis Tools": "₹6,654",
          "Safety Equipment": "₹2,500",
          "Instructions Manual": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "112",
        name: "Lava Lamp (Real Lava)",
        price: "₹52,345",
        image: "🌋",
        description: "Authentic lava lamp made with real Venusian lava. Warning: Do not touch!",
        planet: "Venus",
        breakdown: {
          "Lava Collection": "₹40,000",
          "Lamp Assembly": "₹8,345",
          "Safety Containment": "₹3,500",
          "Warning Labels": "₹500"
        },
        isExclusive: 1
      },
      
      // Jupiter Exclusives
      {
        id: "113",
        name: "Floating Jupiter Balloon",
        price: "₹45,678",
        image: "🎈",
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
        id: "114",
        name: "Great Red Spot Stress Ball",
        price: "₹33,456",
        image: "🔴",
        description: "Squeeze away your stress with this replica of Jupiter's famous storm. It's been raging for centuries!",
        planet: "Jupiter",
        breakdown: {
          "Storm Replication": "₹25,000",
          "Stress Ball Material": "₹5,456",
          "Rage Testing": "₹2,500",
          "Packaging": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "115",
        name: "Hurricane Wind Chimes",
        price: "₹28,765",
        image: "🎐",
        description: "Wind chimes that recreate the soothing sounds of Jupiter's 400mph winds. Very relaxing!",
        planet: "Jupiter",
        breakdown: {
          "Wind Sound Recording": "₹20,000",
          "Chime Manufacturing": "₹6,765",
          "Sound Quality Testing": "₹1,500",
          "Meditation Guide": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "116",
        name: "Gas Giant Inhaler",
        price: "₹67,890",
        image: "💨",
        description: "Breathe in the atmosphere of Jupiter! Warning: Not actually breathable.",
        planet: "Jupiter",
        breakdown: {
          "Atmosphere Compression": "₹50,000",
          "Inhaler Device": "₹12,890",
          "Safety Warnings": "₹4,500",
          "Medical Disclaimer": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "117",
        name: "Magnetic Field Generator",
        price: "₹89,123",
        image: "🧲",
        description: "Mini magnetic field generator based on Jupiter's powerful magnetosphere. Attracts everything!",
        planet: "Jupiter",
        breakdown: {
          "Magnetic Technology": "₹70,000",
          "Field Generator": "₹14,123",
          "Power Source": "₹4,500",
          "Safety Manual": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "118",
        name: "Moon Collection Set",
        price: "₹76,543",
        image: "🌕",
        description: "Miniature replicas of Jupiter's 79 moons. Collect them all! (Some assembly required)",
        planet: "Jupiter",
        breakdown: {
          "79 Mini Moons": "₹60,000",
          "Display Case": "₹12,543",
          "Assembly Kit": "₹3,500",
          "Instruction Book": "₹500"
        },
        isExclusive: 1
      },
      
      // Saturn Exclusives
      {
        id: "119",
        name: "Saturn Ring Fragment",
        price: "₹67,890",
        image: "💍",
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
        id: "120",
        name: "Hexagon Puzzle Box",
        price: "₹43,210",
        image: "🔷",
        description: "Puzzle box inspired by Saturn's mysterious hexagonal polar storm. Can you solve it?",
        planet: "Saturn",
        breakdown: {
          "Hexagon Engineering": "₹32,000",
          "Puzzle Mechanics": "₹8,210",
          "Difficulty Testing": "₹2,500",
          "Solution Guide": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "121",
        name: "Low Density Foam",
        price: "₹23,456",
        image: "🟡",
        description: "Foam so light it would float on water, just like Saturn! Perfect for space beds.",
        planet: "Saturn",
        breakdown: {
          "Density Calculations": "₹15,000",
          "Foam Manufacturing": "₹6,456",
          "Flotation Testing": "₹1,500",
          "Comfort Rating": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "122",
        name: "Titan Methane Candle",
        price: "₹34,567",
        image: "🕯️",
        description: "Scented candle made from Titan's methane lakes. Smells like... well, methane.",
        planet: "Saturn",
        breakdown: {
          "Methane Extraction": "₹25,000",
          "Candle Making": "₹6,567",
          "Scent Development": "₹2,500",
          "Warning Labels": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "123",
        name: "Ring Hula Hoop Set",
        price: "₹56,789",
        image: "⭕",
        description: "Multiple hula hoops to recreate Saturn's ring system around your waist. Exercise in space style!",
        planet: "Saturn",
        breakdown: {
          "Multi-Ring Design": "₹42,000",
          "Space-Grade Material": "₹10,789",
          "Orbital Mechanics": "₹3,500",
          "Fitness Guide": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "124",
        name: "Shepherd Moon Pet",
        price: "₹45,678",
        image: "🐕",
        description: "Virtual pet that keeps your ring particles in line, just like Saturn's shepherd moons!",
        planet: "Saturn",
        breakdown: {
          "AI Programming": "₹35,000",
          "Virtual Pet Device": "₹7,678",
          "Shepherding Training": "₹2,500",
          "Digital Treats": "₹500"
        },
        isExclusive: 1
      },
      
      // Neptune Exclusives
      {
        id: "125",
        name: "Neptune Ice Cube Tray",
        price: "₹34,567",
        image: "🧊",
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
        id: "126",
        name: "Diamond Rain Collector",
        price: "₹89,123",
        image: "💎",
        description: "Collect actual diamond rain from Neptune's atmosphere! Results may vary.",
        planet: "Neptune",
        breakdown: {
          "Rain Collection System": "₹70,000",
          "Diamond Processing": "₹15,123",
          "Quality Assurance": "₹3,500",
          "Gemologist Certificate": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "127",
        name: "Supersonic Wind Bottle",
        price: "₹76,543",
        image: "🌪️",
        description: "Bottled winds from Neptune's supersonic storms. Fastest winds in the solar system!",
        planet: "Neptune",
        breakdown: {
          "Wind Capture": "₹60,000",
          "Pressure Bottling": "₹12,543",
          "Speed Certification": "₹3,500",
          "Caution Labels": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "128",
        name: "Deep Blue Paint",
        price: "₹23,456",
        image: "🎨",
        description: "Paint that captures Neptune's beautiful deep blue color. Perfect for ocean-themed rooms!",
        planet: "Neptune",
        breakdown: {
          "Color Analysis": "₹15,000",
          "Paint Manufacturing": "₹6,456",
          "Blue Certification": "₹1,500",
          "Artist Approval": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "129",
        name: "Triton Geyser Water Gun",
        price: "₹45,678",
        image: "🔫",
        description: "Water gun that shoots with the pressure of Triton's nitrogen geysers. Super soaker 3000!",
        planet: "Neptune",
        breakdown: {
          "Geyser Technology": "₹35,000",
          "Water Gun Assembly": "₹7,678",
          "Pressure Testing": "₹2,500",
          "Safety Features": "₹500"
        },
        isExclusive: 1
      },
      {
        id: "130",
        name: "Retrograde Orbit Spinner",
        price: "₹67,890",
        image: "🔄",
        description: "Fidget spinner that rotates backwards like Triton's orbit. Confuses everyone!",
        planet: "Neptune",
        breakdown: {
          "Reverse Engineering": "₹50,000",
          "Spinner Manufacturing": "₹12,890",
          "Confusion Testing": "₹4,500",
          "Instruction Manual": "₹500"
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
