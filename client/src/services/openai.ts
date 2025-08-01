import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface CosmicPriceResult {
  price: string;
  breakdown: Record<string, string>;
}

const destinationMultipliers: Record<string, number> = {
  "Moon": 1.2,
  "Space Station": 0.8, // Special discount for space station
  "Mars": 2.0,
  "Venus": 2.5,
  "Mercury": 3.0,
  "Jupiter": 4.0,
  "Saturn": 4.5,
  "Uranus": 5.0,
  "Neptune": 5.5,
  "Pluto": 6.0,
};

const deliveryAgencies = [
  "CosmicExpress",
  "GalacticShipping Co.",
  "InterPlanetary Logistics",
  "StarRush Delivery",
  "NebulaTransport Ltd.",
  "WarpSpeed Couriers"
];

function getRandomAgency(): string {
  return deliveryAgencies[Math.floor(Math.random() * deliveryAgencies.length)];
}

function getBasePrice(item: string): number {
  const itemLower = item.toLowerCase();
  
  // Basic price mapping based on item type
  if (itemLower.includes('iphone') || itemLower.includes('phone')) return 80000;
  if (itemLower.includes('laptop') || itemLower.includes('computer')) return 150000;
  if (itemLower.includes('pizza') || itemLower.includes('food')) return 500;
  if (itemLower.includes('coffee') || itemLower.includes('drink')) return 300;
  if (itemLower.includes('book')) return 800;
  if (itemLower.includes('car') || itemLower.includes('vehicle')) return 2000000;
  if (itemLower.includes('watch')) return 50000;
  if (itemLower.includes('shoes') || itemLower.includes('clothes')) return 5000;
  if (itemLower.includes('tv') || itemLower.includes('television')) return 100000;
  if (itemLower.includes('game') || itemLower.includes('toy')) return 3000;
  
  // Default price
  return 2000;
}

function generateFallbackPrice(item: string, planet: string, agency: string): CosmicPriceResult {
  const basePrice = getBasePrice(item);
  const multiplier = destinationMultipliers[planet] || 2.0;
  
  // Generate cosmic multiplier (between 100x to 1000x)
  const cosmicMultiplier = Math.floor(Math.random() * 900) + 100;
  const totalMultiplier = multiplier * cosmicMultiplier;
  
  const finalPrice = Math.floor(basePrice * totalMultiplier);
  
  // Generate breakdown
  const breakdown: Record<string, string> = {
    "Base Price": `₹${basePrice.toLocaleString('en-IN')}`,
    "Space Bureaucracy Fee": `₹${Math.floor(finalPrice * 0.25).toLocaleString('en-IN')}`,
    "Alien Customs Bribe": `₹${Math.floor(finalPrice * 0.20).toLocaleString('en-IN')}`,
    "Rocket Fuel Surcharge": `₹${Math.floor(finalPrice * 0.30).toLocaleString('en-IN')}`,
    [`${agency} Premium Service`]: `₹${Math.floor(finalPrice * 0.15).toLocaleString('en-IN')}`,
    "Cosmic Insurance": `₹${Math.floor(finalPrice * 0.10).toLocaleString('en-IN')}`
  };

  // Add special space station discount
  if (planet === "Space Station") {
    breakdown["Space Station Discount"] = `-₹${Math.floor(finalPrice * 0.20).toLocaleString('en-IN')}`;
  }

  return {
    price: `₹${finalPrice.toLocaleString('en-IN')}`,
    breakdown
  };
}

export async function generateCosmicPrice(
  item: string,
  planet: string,
  agency?: string
): Promise<CosmicPriceResult> {
  const selectedAgency = agency || getRandomAgency();
  
  // Check if OpenAI API key is available
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, using fallback pricing");
    return generateFallbackPrice(item, planet, selectedAgency);
  }

  try {
    const basePrice = getBasePrice(item);
    const multiplier = destinationMultipliers[planet] || 2.0;
    
    const prompt = `You are a humorous intergalactic pricing agent. Calculate the cost of delivering "${item}" to ${planet} using ${selectedAgency}.

Base price: ₹${basePrice.toLocaleString('en-IN')}
Planet multiplier: ${multiplier}x
${planet === "Space Station" ? "SPECIAL: Apply space station resident discount!" : ""}

Create a total price between ₹${Math.floor(basePrice * multiplier * 50).toLocaleString('en-IN')} and ₹${Math.floor(basePrice * multiplier * 500).toLocaleString('en-IN')}.

Response must be JSON with:
{
  "price": "₹X,XX,XXX",
  "breakdown": {
    "Base Price": "₹${basePrice.toLocaleString('en-IN')}",
    "Space Bureaucracy Fee": "₹XX,XXX",
    "Alien Customs Bribe": "₹XX,XXX",
    "Rocket Fuel Surcharge": "₹XX,XXX",
    "${selectedAgency} Premium": "₹XX,XXX",
    "Cosmic Insurance": "₹XX,XXX"${planet === "Space Station" ? ',\n    "Space Station Discount": "-₹XX,XXX"' : ""}
  }
}

Make fees hilarious but realistic. Use Indian Rupee formatting with commas.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are a cosmic delivery pricing calculator. Always respond with valid JSON only."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (result.price && result.breakdown) {
      return result;
    } else {
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.warn("AI pricing failed, using fallback:", error);
    return generateFallbackPrice(item, planet, selectedAgency);
  }
}