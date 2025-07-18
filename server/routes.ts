import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRequestSchema } from "@shared/schema";
import { z } from "zod";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY_ENV_VAR || "default_key";

function getPromptTemplate(content: string, type: string): string {
  switch (type) {
    case 'few-shot':
      return `Here are some examples of how to respond to similar questions:

Example 1:
Q: What is machine learning?
A: Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.

Example 2:
Q: How does blockchain work?
A: Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.

Now, please answer the following question in a similar style:
Q: ${content}
A:`;

    case 'chain-of-thought':
      return `Please think through this step by step and show your reasoning process.

Question: ${content}

Let me think about this step by step:
1. First, I need to understand what is being asked
2. Then, I'll break down the key concepts
3. Finally, I'll provide a comprehensive answer

Please provide your step-by-step reasoning and final answer:`;

    case 'zero-shot':
    default:
      return content;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateRequestSchema.parse(req.body);
      
      const { prompt, promptType, model, temperature, maxTokens, compareModel } = validatedData;
      
      // Create prompt record
      const promptRecord = await storage.createPrompt({
        content: prompt,
        promptType,
        model,
        temperature: Math.round(temperature * 100), // store as integer
        maxTokens,
      });

      // Generate response from primary model
      const primaryResponse = await generateLLMResponse(
        getPromptTemplate(prompt, promptType),
        model,
        temperature,
        maxTokens
      );

      const primaryResponseRecord = await storage.createResponse({
        promptId: promptRecord.id,
        model,
        content: primaryResponse.content,
        metadata: primaryResponse.metadata,
        cost: primaryResponse.cost,
        duration: primaryResponse.duration,
      });

      let compareResponseRecord = null;
      if (compareModel && compareModel !== model) {
        const compareResponse = await generateLLMResponse(
          getPromptTemplate(prompt, promptType),
          compareModel,
          temperature,
          maxTokens
        );

        compareResponseRecord = await storage.createResponse({
          promptId: promptRecord.id,
          model: compareModel,
          content: compareResponse.content,
          metadata: compareResponse.metadata,
          cost: compareResponse.cost,
          duration: compareResponse.duration,
        });
      }

      res.json({
        promptId: promptRecord.id,
        primaryResponse: primaryResponseRecord,
        compareResponse: compareResponseRecord,
      });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate response" 
      });
    }
  });

  app.get("/api/prompts/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentPrompts = await storage.getRecentPrompts(limit);
      res.json(recentPrompts);
    } catch (error) {
      console.error("Error fetching recent prompts:", error);
      res.status(500).json({ message: "Failed to fetch recent prompts" });
    }
  });

  app.get("/api/prompts/:id/responses", async (req, res) => {
    try {
      const promptId = parseInt(req.params.id);
      const responses = await storage.getResponsesByPromptId(promptId);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateLLMResponse(
  prompt: string,
  model: string,
  temperature: number,
  maxTokens: number
): Promise<{
  content: string;
  metadata: any;
  cost: number;
  duration: number;
}> {
  const startTime = Date.now();
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prompt-playground.replit.app",
        "X-Title": "Prompt Engineering Playground",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    // Calculate approximate cost (this is a rough estimate)
    const tokensUsed = data.usage?.total_tokens || 0;
    const estimatedCost = Math.round(tokensUsed * 0.002 * 1000); // $0.002 per 1K tokens, stored in micro-dollars

    return {
      content: data.choices[0].message.content,
      metadata: data,
      cost: estimatedCost,
      duration,
    };
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
