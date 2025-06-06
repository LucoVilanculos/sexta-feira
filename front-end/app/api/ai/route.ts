import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Usando um modelo público do HuggingFace
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages as Message[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Formato de mensagem inválido." },
        { status: 400 }
      );
    }

    // Pegando a última mensagem do usuário
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: lastMessage,
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // O modelo retorna um array com a resposta gerada
    const aiResponse = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Resposta vazia do modelo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      response: aiResponse
    });

  } catch (error) {
    console.error("Erro na API:", error);
    
    return NextResponse.json(
      { error: "Erro ao processar a mensagem." },
      { status: 500 }
    );
  }
}