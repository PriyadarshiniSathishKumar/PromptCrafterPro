import { apiRequest } from "./queryClient";
import type { GenerateRequest } from "@shared/schema";

export async function generateResponse(request: GenerateRequest) {
  const response = await apiRequest("POST", "/api/generate", request);
  return response.json();
}

export async function getRecentPrompts(limit: number = 10) {
  const response = await apiRequest("GET", `/api/prompts/recent?limit=${limit}`);
  return response.json();
}

export async function getPromptResponses(promptId: number) {
  const response = await apiRequest("GET", `/api/prompts/${promptId}/responses`);
  return response.json();
}
