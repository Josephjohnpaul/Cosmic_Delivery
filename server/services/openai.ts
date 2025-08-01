import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CosmicPriceResult {
  price: string;
  breakdown: Record<string, string>;
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
          content: `You are a humorous AI pricing specialist for "Cosmic Delivery", an intergalactic marketplace that charges ridiculously high prices for delivering Earth items to other planets. Generate absurdly expensive prices in Indian Rupees (₹) for items with detailed cost breakdowns that are funny and over-the-top.

Consider factors like:
- Distance to planet
- Environmental hazards
- Delivery agency premium
- Ridiculous insurance costs
- Cosmic bureaucracy fees
- Fuel costs
- Safety equipment

Make the prices astronomically high (millions to billions of rupees) and the breakdown items humorous but believable in a sci-fi context.

Respond with JSON in this exact format:
{
  "price": "₹X,XX,XX,XXX",
  "breakdown": {
    "Base Item Price": "₹XXX",
    "Interplanetary Shipping": "₹X,XX,XX,XXX",
    "Cosmic Insurance": "₹X,XX,XXX",
    "Fuel Costs": "₹X,XX,XXX",
    "Safety Equipment": "₹X,XX,XXX",
    "Agency Premium": "₹X,XX,XXX"
  }
}`
        },
        {
          role: "user",
          content: `Generate a cosmic delivery price for: ${item} to ${planet} via ${agency} delivery agency`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      price: result.price || "₹99,99,99,999",
      breakdown: result.breakdown || {
        "Base Item Price": "₹1,000",
        "Cosmic Delivery": "₹99,99,98,999"
      }
    };
  } catch (error) {
    console.error("Failed to generate cosmic price:", error);
    // Fallback pricing
    return {
      price: "₹50,00,00,000",
      breakdown: {
        "Base Item Price": "₹1,000",
        "Interplanetary Shipping": "₹25,00,00,000",
        "Cosmic Insurance": "₹15,00,00,000",
        "Fuel Costs": "₹8,00,00,000",
        "Agency Premium": "₹1,99,99,000"
      }
    };
  }
}

export async function generateComparisonPrices(item: string): Promise<Record<string, string>> {
  try {
    const planets = ["Mars", "Venus", "Jupiter", "Saturn", "Neptune"];
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate comparison prices for delivering an Earth item to different planets. Make prices vary significantly based on distance and difficulty. Use Indian Rupees format. Respond with JSON:
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
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Failed to generate comparison prices:", error);
    // Fallback pricing
    return {
      "Mars": "₹5,00,00,000",
      "Venus": "₹7,50,00,000",
      "Jupiter": "₹15,00,00,000",
      "Saturn": "₹12,00,00,000",
      "Neptune": "₹20,00,00,000"
    };
  }
}
