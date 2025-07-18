import { prompts, responses, type Prompt, type InsertPrompt, type Response, type InsertResponse } from "@shared/schema";

export interface IStorage {
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPrompts(): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  
  getResponse(id: number): Promise<Response | undefined>;
  getResponsesByPromptId(promptId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;
  
  getRecentPrompts(limit?: number): Promise<Prompt[]>;
}

export class MemStorage implements IStorage {
  private prompts: Map<number, Prompt>;
  private responses: Map<number, Response>;
  private promptIdCounter: number;
  private responseIdCounter: number;

  constructor() {
    this.prompts = new Map();
    this.responses = new Map();
    this.promptIdCounter = 1;
    this.responseIdCounter = 1;
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.promptIdCounter++;
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      temperature: insertPrompt.temperature ?? 70,
      maxTokens: insertPrompt.maxTokens ?? 500,
      createdAt: new Date(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getResponse(id: number): Promise<Response | undefined> {
    return this.responses.get(id);
  }

  async getResponsesByPromptId(promptId: number): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.promptId === promptId
    );
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.responseIdCounter++;
    const response: Response = {
      ...insertResponse,
      id,
      metadata: insertResponse.metadata ?? {},
      cost: insertResponse.cost ?? 0,
      duration: insertResponse.duration ?? 0,
      promptId: insertResponse.promptId ?? null,
      createdAt: new Date(),
    };
    this.responses.set(id, response);
    return response;
  }

  async getRecentPrompts(limit: number = 10): Promise<Prompt[]> {
    const allPrompts = Array.from(this.prompts.values());
    return allPrompts
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
