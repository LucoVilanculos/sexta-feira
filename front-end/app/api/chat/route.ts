import { NextResponse } from "next/server"
import { ChatResponse, SendMessageRequest } from "@/types/chat"

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as SendMessageRequest

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" } as ChatResponse,
        { status: 400 }
      )
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          text: message,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response from AI")
    }

    const data = await response.json()
    return NextResponse.json({ 
      response: data[0].generated_text 
    } as ChatResponse)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to process request" } as ChatResponse,
      { status: 500 }
    )
  }
} 