import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CosmicPriceResult {
  price: string;
  breakdown: Record<string, string>;
}

// Helper function to estimate base price based on item characteristics
function estimateBasePrice(item: string): number {
  const lowerItem = item.toLowerCase();
  
  // Electronics and tech items
  if (lowerItem.includes('laptop') || lowerItem.includes('computer') || lowerItem.includes('gaming')) {
    return Math.floor(Math.random() * 200000) + 100000; // ₹1L - ₹3L
  }
  if (lowerItem.includes('phone') || lowerItem.includes('smartphone') || lowerItem.includes('mobile')) {
    return Math.floor(Math.random() * 80000) + 40000; // ₹40K - ₹1.2L
  }
  if (lowerItem.includes('headphone') || lowerItem.includes('earphone') || lowerItem.includes('speaker')) {
    return Math.floor(Math.random() * 30000) + 5000; // ₹5K - ₹35K
  }
  
  // Clothing and accessories
  if (lowerItem.includes('shoe') || lowerItem.includes('sneaker') || lowerItem.includes('boot')) {
    return Math.floor(Math.random() * 15000) + 3000; // ₹3K - ₹18K
  }
  if (lowerItem.includes('watch') || lowerItem.includes('sunglass') || lowerItem.includes('glasses')) {
    return Math.floor(Math.random() * 25000) + 2000; // ₹2K - ₹27K
  }
  
  // Food items
  if (lowerItem.includes('pizza') || lowerItem.includes('burger') || lowerItem.includes('food')) {
    return Math.floor(Math.random() * 800) + 200; // ₹200 - ₹1000
  }
  if (lowerItem.includes('coffee') || lowerItem.includes('tea') || lowerItem.includes('drink')) {
    return Math.floor(Math.random() * 1000) + 100; // ₹100 - ₹1100
  }
  if (lowerItem.includes('chocolate') || lowerItem.includes('candy') || lowerItem.includes('sweet')) {
    return Math.floor(Math.random() * 300) + 50; // ₹50 - ₹350
  }
  
  // Home and lifestyle
  if (lowerItem.includes('plant') || lowerItem.includes('flower')) {
    return Math.floor(Math.random() * 500) + 100; // ₹100 - ₹600
  }
  if (lowerItem.includes('book') || lowerItem.includes('magazine')) {
    return Math.floor(Math.random() * 1000) + 200; // ₹200 - ₹1200
  }
  
  // Default for unknown items
  return Math.floor(Math.random() * 5000) + 500; // ₹500 - ₹5500
}

function generateFallbackPricing(item: string, planet: string, agency: string): CosmicPriceResult {
  const basePrice = estimateBasePrice(item);
  
  // Planet distance multipliers
  const planetMultipliers = {
    'mars': 150,
    'venus': 200,
    'jupiter': 500,
    'saturn': 400,
    'neptune': 800
  };
  
  // Agency multipliers
  const agencyMultipliers = {
    'express': 2,
    'premium': 3,
    'budget': 1.5,
    'luxury': 4
  };
  
  const planetMultiplier = planetMultipliers[planet.toLowerCase() as keyof typeof planetMultipliers] || 300;
  const agencyMultiplier = agencyMultipliers[agency.toLowerCase() as keyof typeof agencyMultipliers] || 2;
  
  const shippingCost = Math.floor(basePrice * planetMultiplier * agencyMultiplier);
  const insurance = Math.floor(shippingCost * 0.6);
  const bureaucracy = Math.floor(shippingCost * 0.4);
  const maintenance = Math.floor(shippingCost * 0.3);
  const taxes = Math.floor(shippingCost * 0.2);
  
  const totalPrice = basePrice + shippingCost + insurance + bureaucracy + maintenance + taxes;
  
  return {
    price: `₹${totalPrice.toLocaleString('en-IN')}`,
    breakdown: {
      "Base Item Price": `₹${basePrice.toLocaleString('en-IN')}`,
      "Interplanetary Shipping": `₹${shippingCost.toLocaleString('en-IN')}`,
      "Space Bureaucracy Fee": `₹${bureaucracy.toLocaleString('en-IN')}`,
      "Cosmic Insurance": `₹${insurance.toLocaleString('en-IN')}`,
      "Rocket Maintenance": `₹${maintenance.toLocaleString('en-IN')}`,
      "Alien Import Taxes": `₹${taxes.toLocaleString('en-IN')}`
    }
  };
}

export async function generateCosmicPrice(
  item: string,
  planet: string,
  agency: string
): Promise<CosmicPriceResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a humorous AI pricing specialist for "Cosmic Delivery". First, accurately estimate the realistic base price of the Earth item in Indian Rupees based on its actual market value, size, weight, and complexity. Then create a hilarious cosmic delivery price breakdown.

Guidelines:
- Start with accurate base pricing (e.g., smartphone ₹80,000, pizza ₹400, laptop ₹150,000)
- Create funny breakdown items like "Space Bureaucracy Fee", "Alien Customs Bribe", "Meteor Dodge Insurance"
- Planet distance affects shipping costs
- Agency type affects premiums
- Total should be 100-1000x the base price

Respond with JSON:
{
  "price": "₹X,XX,XX,XXX",
  "breakdown": {
    "Base Item Price": "₹accurate_price",
    "Space Bureaucracy Fee": "₹XX,XX,XXX",
    "Alien Customs Bribe": "₹XX,XX,XXX",
    "Rocket Fuel Surcharge": "₹XX,XX,XXX",
    "Meteor Dodge Insurance": "₹XX,XX,XXX",
    "Agency Premium": "₹XX,XX,XXX"
  }
}`
        },
        {
          role: "user",
          content: `Generate cosmic pricing for: ${item} to ${planet} via ${agency} delivery`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      price: result.price || generateFallbackPricing(item, planet, agency).price,
      breakdown: result.breakdown || generateFallbackPricing(item, planet, agency).breakdown
    };
  } catch (error) {
    console.error("Failed to generate cosmic price:", error);
    // Use intelligent fallback pricing
    return generateFallbackPricing(item, planet, agency);
  }
}

function generateFallbackComparison(item: string): Record<string, string> {
  const basePrice = estimateBasePrice(item);
  
  const planetData = {
    "Mars": { multiplier: 150, emoji: "🔴" },
    "Venus": { multiplier: 200, emoji: "🟡" },  
    "Jupiter": { multiplier: 500, emoji: "🟠" },
    "Saturn": { multiplier: 400, emoji: "🪐" },
    "Neptune": { multiplier: 800, emoji: "🔵" }
  };
  
  const result: Record<string, string> = {};
  
  for (const [planet, data] of Object.entries(planetData)) {
    const totalPrice = Math.floor(basePrice * data.multiplier);
    result[planet] = `₹${totalPrice.toLocaleString('en-IN')}`;
  }
  
  return result;
}

export async function generateComparisonPrices(item: string): Promise<Record<string, string>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate realistic comparison prices for delivering an Earth item to different planets. Start with accurate base pricing for the item, then apply planet-specific multipliers based on distance and difficulty.

Price ranges should reflect:
- Mars: Closest, 100-200x base price
- Venus: Harsh environment, 150-300x base price  
- Jupiter: Far gas giant, 400-600x base price
- Saturn: Ring navigation, 300-500x base price
- Neptune: Farthest, 700-1000x base price

Use Indian Rupees format. Respond with JSON:
{
  "Mars": "₹X,XX,XX,XXX",
  "Venus": "₹X,XX,XX,XXX", 
  "Jupiter": "₹X,XX,XX,XXX",
  "Saturn": "₹X,XX,XX,XXX",
  "Neptune": "₹X,XX,XX,XXX"
}`
        },
        {
          role: "user",
          content: `Generate comparison prices for: ${item}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.Mars ? result : generateFallbackComparison(item);
  } catch (error) {
    console.error("Failed to generate comparison prices:", error);
    return generateFallbackComparison(item);
  }
}
