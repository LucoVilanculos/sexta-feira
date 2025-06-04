export const fetcAiResponse = async (prompt: string) => {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "Você é uma IA simpática chamada Sexta-feira, que me ajuda a gerenciar minhas tarefas, projetos e vida pessoal. Responda de forma amigável e útil.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) return "";

  const data = await response.json();
  return data.response;
}