import { CommandResponse } from "@/types/commands";
import { apiClient } from "@/lib/api";

export async function executeCommand(command: string): Promise<CommandResponse> {
  try {
    const response = await apiClient.post<CommandResponse>("/api/commands", { command });
    return response;
  } catch (error) {
    console.error("Error executing command:", error);
    throw error;
  }
}
