import { type Product } from "@shared/schema";

export const defaultProducts: Product[] = [
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
    name: "Smartphone",
    price: "₹8,99,99,999",
    image: "📱",
    description: "Latest smartphone with cosmic signal booster and radiation-proof case for Saturn's rings.",
    planet: "Saturn",
    breakdown: {
      "Base Price": "₹80,000",
      "Ring System Navigation": "₹3,45,67,890",
      "Cosmic Signal Amplifier": "₹2,34,56,789",
      "Radiation Shielding": "₹1,78,90,123",
      "Zero-G Screen Protector": "₹1,45,67,891",
      "Alien Network Setup": "₹95,17,306"
    },
    isExclusive: 0
  },
  {
    id: "5",
    name: "Yoga Mat",
    price: "₹45,67,890",
    image: "🧘",
    description: "Anti-gravity yoga mat perfect for meditation in Neptune's floating ice crystals.",
    planet: "Neptune",
    breakdown: {
      "Base Price": "₹2,000",
      "Anti-Gravity Technology": "₹25,00,000",
      "Ice Crystal Resistance": "₹15,45,890",
      "Mindfulness License": "₹3,20,000",
      "Deep Space Shipping": "₹2,00,000"
    },
    isExclusive: 0
  }
];

export const exclusiveProducts: Product[] = [
  // Mars Exclusives
  {
    id: "101",
    name: "Martian Rock Candy",
    price: "₹15,67,890",
    image: "🍬",
    description: "Sweet treats made from actual Martian soil! Now with 50% less iron oxide taste.",
    planet: "Mars",
    breakdown: {
      "Soil Collection": "₹8,00,000",
      "Candy Processing": "₹4,67,890",
      "Taste Enhancement": "₹2,50,000",
      "Health Certification": "₹50,000"
    },
    isExclusive: 1
  },
  {
    id: "102",
    name: "Red Planet Sunglasses",
    price: "₹23,45,678",
    image: "🕶️",
    description: "Stylish red-tinted glasses that make everything look like Mars. Perfect for homesick Martians!",
    planet: "Mars",
    breakdown: {
      "Red Lens Technology": "₹15,00,000",
      "Martian Fashion License": "₹6,45,678",
      "Dust Resistance": "₹1,50,000",
      "Style Certification": "₹50,000"
    },
    isExclusive: 1
  },

  // Venus Exclusives
  {
    id: "103",
    name: "Cloud Walking Boots",
    price: "₹89,12,345",
    image: "🥾",
    description: "Special boots that let you walk on Venus's thick clouds. Acid-proof and surprisingly comfortable!",
    planet: "Venus",
    breakdown: {
      "Cloud Technology": "₹70,00,000",
      "Acid Protection": "₹15,12,345",
      "Comfort Padding": "₹3,50,000",
      "Safety Testing": "₹50,000"
    },
    isExclusive: 1
  },
  {
    id: "104",
    name: "Heat Shield Umbrella",
    price: "₹34,56,789",
    image: "☂️",
    description: "The only umbrella that can protect you from 900°F surface temperatures. Lightweight and stylish!",
    planet: "Venus",
    breakdown: {
      "Heat Shield Material": "₹25,00,000",
      "Temperature Resistance": "₹7,56,789",
      "Lightweight Design": "₹1,50,000",
      "Style Points": "₹50,000"
    },
    isExclusive: 1
  },

  // Jupiter Exclusives
  {
    id: "105",
    name: "Storm Surfboard",
    price: "₹67,89,012",
    image: "🏄",
    description: "Ride the Great Red Spot like a wave! Comes with magnetic boots and storm insurance.",
    planet: "Jupiter",
    breakdown: {
      "Storm Resistance": "₹50,00,000",
      "Magnetic Boot System": "₹12,89,012",
      "Storm Insurance": "₹4,50,000",
      "Thrill Guarantee": "₹50,000"
    },
    isExclusive: 1
  },
  {
    id: "106",
    name: "Gas Giant Air Freshener",
    price: "₹12,34,567",
    image: "🌬️",
    description: "Makes Jupiter's methane atmosphere smell like fresh Earth flowers. Lasts for 100 Earth years!",
    planet: "Jupiter",
    breakdown: {
      "Methane Neutralizer": "₹8,00,000",
      "Flower Essence": "₹3,34,567",
      "Longevity Formula": "₹50,000",
      "Scent License": "₹50,000"
    },
    isExclusive: 1
  },

  // Saturn Exclusives
  {
    id: "107",
    name: "Ring Hopping Shoes",
    price: "₹45,67,890",
    image: "👟",
    description: "Specially designed shoes that let you hop from ring to ring around Saturn. Perfect grip on ice particles!",
    planet: "Saturn",
    breakdown: {
      "Ring Navigation Tech": "₹35,00,000",
      "Ice Particle Grip": "₹8,67,890",
      "Safety Harness": "₹1,50,000",
      "Hopping License": "₹50,000"
    },
    isExclusive: 1
  },
  {
    id: "108",
    name: "Hexagon Puzzle Game",
    price: "₹23,45,678",
    image: "🧩",
    description: "Inspired by Saturn's mysterious hexagonal storm! The most challenging puzzle in the solar system.",
    planet: "Saturn",
    breakdown: {
      "Storm Research": "₹15,00,000",
      "Puzzle Design": "₹6,45,678",
      "Difficulty Testing": "₹1,50,000",
      "Sanity Insurance": "₹50,000"
    },
    isExclusive: 1
  },

  // Neptune Exclusives
  {
    id: "109",
    name: "Diamond Rain Collector",
    price: "₹99,99,999",
    image: "💎",
    description: "Collect Neptune's famous diamond rain! Comes with pressure-resistant collection dome.",
    planet: "Neptune",
    breakdown: {
      "Diamond Detection": "₹70,00,000",
      "Pressure Dome": "₹25,99,999",
      "Collection System": "₹3,50,000",
      "Certification": "₹50,000"
    },
    isExclusive: 1
  },
  {
    id: "110",
    name: "Ice Crystal Wind Chimes",
    price: "₹34,56,789",
    image: "🎐",
    description: "Beautiful wind chimes made from Neptune's frozen methane crystals. Creates hauntingly beautiful music!",
    planet: "Neptune",
    breakdown: {
      "Crystal Harvesting": "₹25,00,000",
      "Musical Tuning": "₹7,56,789",
      "Preservation Tech": "₹1,50,000",
      "Artistic License": "₹50,000"
    },
    isExclusive: 1
  },

  // Moon Exclusives
  {
    id: "131",
    name: "Lunar Dust Snow Globe",
    price: "₹15,432",
    image: "🌙",
    description: "Real lunar dust in a beautiful snow globe. Shake to create your own moon dust storm!",
    planet: "Moon",
    breakdown: {
      "Dust Collection": "₹8,000",
      "Globe Manufacturing": "₹4,432",
      "Anti-Static Treatment": "₹2,500",
      "NASA Approval": "₹500"
    },
    isExclusive: 1
  },
  {
    id: "132",
    name: "Armstrong's Footprint Cast",
    price: "₹89,765",
    image: "👣",
    description: "Replica of Neil Armstrong's first footprint on the Moon. One small step for man!",
    planet: "Moon",
    breakdown: {
      "Historical Significance": "₹70,000",
      "Cast Manufacturing": "₹15,765",
      "Authentication": "₹3,500",
      "Display Stand": "₹500"
    },
    isExclusive: 1
  },

  // Space Station Exclusives
  {
    id: "133",
    name: "Zero Gravity Coffee Mug",
    price: "₹12,345",
    image: "☕",
    description: "Coffee mug designed for zero gravity. Your coffee floats perfectly in the mug! DISCOUNT APPLIED!",
    planet: "Space Station",
    breakdown: {
      "Anti-Gravity Design": "₹8,000",
      "Space Station Discount": "-₹3,000",
      "Magnetic Base": "₹6,345",
      "Astronaut Testing": "₹1,000"
    },
    isExclusive: 1
  },
  {
    id: "134",
    name: "Floating Pen Set",
    price: "₹8,765",
    image: "✒️",
    description: "Pens that write in zero gravity! Special space station resident discount included.",
    planet: "Space Station",
    breakdown: {
      "Zero-G Ink Technology": "₹6,000",
      "Space Station Discount": "-₹2,000",
      "Magnetic Clip": "₹3,765",
      "Quality Testing": "₹1,000"
    },
    isExclusive: 1
  },

  // Mercury Exclusives
  {
    id: "135",
    name: "Solar Flare Sunglasses",
    price: "₹45,678",
    image: "🕶️",
    description: "Ultra-protective sunglasses designed for Mercury's intense solar radiation. SPF 10,000!",
    planet: "Mercury",
    breakdown: {
      "Solar Protection Tech": "₹35,000",
      "Heat Resistance": "₹8,678",
      "Thermal Coating": "₹1,500",
      "Safety Certification": "₹500"
    },
    isExclusive: 1
  },

  // Uranus Exclusives
  {
    id: "136",
    name: "Sideways Compass",
    price: "₹34,567",
    image: "🧭",
    description: "The only compass that works on a planet that rotates sideways! Navigation made confusing.",
    planet: "Uranus",
    breakdown: {
      "Sideways Calibration": "₹25,000",
      "Magnetic Confusion Tech": "₹6,567",
      "Orientation Manual": "₹2,500",
      "Directional Testing": "₹500"
    },
    isExclusive: 1
  },

  // Pluto Exclusives  
  {
    id: "137",
    name: "Honorary Planet Certificate",
    price: "₹99,999",
    image: "🏆",
    description: "Official certificate declaring Pluto as still a planet in your heart. Emotional value included!",
    planet: "Pluto",
    breakdown: {
      "Emotional Significance": "₹80,000",
      "Certificate Printing": "₹15,999",
      "Frame & Shipping": "₹3,500",
      "Tears of Joy": "₹500"
    },
    isExclusive: 1
  }
];

export const allProducts = [...defaultProducts, ...exclusiveProducts];