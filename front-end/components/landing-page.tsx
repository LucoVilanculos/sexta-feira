"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Calendar, MessageSquare, Settings, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "IA Inteligente",
      description: "Assistente pessoal que aprende com você",
    },
    {
      icon: Calendar,
      title: "Agenda Inteligente",
      description: "Gerencia suas reuniões automaticamente",
    },
    {
      icon: MessageSquare,
      title: "Conversação Natural",
      description: "Fale naturalmente por voz ou texto",
    },
    {
      icon: Settings,
      title: "Controle Total",
      description: "Controle dispositivos e aplicações",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Sexta-feira
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sua assistente pessoal inteligente. Como JARVIS, mas melhor. Gerencie tarefas, agende reuniões e controle
              tudo com comandos de voz.
            </p>
          </div>

          <div className="flex gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/auth/register">
                Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
            >
              <Link href="/auth/login">Fazer Login</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-purple-500/20 bg-black/40 backdrop-blur-xl transition-all duration-500 ${
                currentFeature === index ? "ring-2 ring-purple-500 scale-105" : ""
              }`}
            >
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Section */}
        <div className="text-center">
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pronta para revolucionar sua produtividade?</h3>
              <p className="text-gray-300 mb-6">
                A Sexta-feira está esperando para se tornar sua assistente pessoal definitiva. Controle por voz,
                automação inteligente e muito mais.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Link href="/auth/register">Ativar Sexta-feira</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
