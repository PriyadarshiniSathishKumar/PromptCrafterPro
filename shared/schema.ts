import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  promptType: text("prompt_type").notNull(),
  model: text("model").notNull(),
  temperature: integer("temperature").default(70),
  maxTokens: integer("max_tokens").default(500),
  createdAt: timestamp("created_at").defaultNow(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").references(() => prompts.id),
  model: text("model").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  cost: integer("cost"), // in micro-dollars
  duration: integer("duration"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

export const generateRequestSchema = z.object({
  prompt: z.string().min(1),
  promptType: z.enum(['zero-shot', 'few-shot', 'chain-of-thought']),
  model: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(4000),
  compareModel: z.string().optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
