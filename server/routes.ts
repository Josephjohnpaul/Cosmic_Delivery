import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { generateCosmicPrice, generateComparisonPrices } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all regular products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get exclusive products
  app.get("/api/products/exclusive", async (req, res) => {
    try {
      const products = await storage.getExclusiveProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exclusive products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Search with AI pricing
  app.post("/api/search", async (req, res) => {
    try {
      const { query, planet, agency } = req.body;
      
      if (!query || !planet || !agency) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (planet === "sun") {
        return res.json({ 
          isSun: true, 
          message: "Congratulations! You're the first to survive selecting the Sun!" 
        });
      }

      const result = await generateCosmicPrice(query, planet, agency);
      res.json({
        item: query,
        planet: planet.charAt(0).toUpperCase() + planet.slice(1),
        agency: agency.charAt(0).toUpperCase() + agency.slice(1),
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate cosmic price" });
    }
  });

  // Price comparison
  app.post("/api/compare", async (req, res) => {
    try {
      const { item } = req.body;
      
      if (!item) {
        return res.status(400).json({ message: "Item is required" });
      }

      const prices = await generateComparisonPrices(item);
      res.json({ item, prices });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate comparison prices" });
    }
  });

  // Cart operations
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const items = await storage.getCartItems(req.params.sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItem = insertCartItemSchema.parse(req.body);
      const item = await storage.addToCart(cartItem);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.sessionId, req.params.productId);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
