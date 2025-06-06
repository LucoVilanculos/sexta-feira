import { CommandResponse } from "@/types/commands";
import { api } from "@/lib/api";

export async function executeCommand(command: string): Promise<CommandResponse> {
  try {
    const response = await api.post("/api/commands", { command });
    return response.data;
  } catch (error) {
    console.error("Error executing command:", error);
    throw error;
  }
} 