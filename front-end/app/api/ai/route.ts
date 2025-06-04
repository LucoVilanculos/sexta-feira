import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('API KEY:', process.env.OPENAI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Troque para gpt-4 se sua chave permitir
      stream: false,
      messages,
    });

    console.log('OpenAI completion:', completion);

    return NextResponse.json({ response: completion.choices?.[0]?.message?.content || "" });
  } catch (error) {
    console.error("Erro na API OpenAI:", error);
    return NextResponse.json({ response: "Erro ao consultar a IA." }, { status: 500 });
  }
}