import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  planet: text("planet").notNull(),
  breakdown: jsonb("breakdown").notNull(),
  isExclusive: integer("is_exclusive").default(0),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  sessionId: text("session_id").notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  price: true,
  image: true,
  description: true,
  planet: true,
  breakdown: true,
  isExclusive: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  productId: true,
  sessionId: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
