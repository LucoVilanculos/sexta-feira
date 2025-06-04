"use client";

import { useState } from "react";

export default function ConfigurationPage() {
  const [assistantName, setAssistantName] = useState("Sexta-feira");
  const [language, setLanguage] = useState("pt-BR");
  const [tone, setTone] = useState("informal");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <div className="bg-gray-800 rounded-lg shadow p-6 max-w-xl space-y-6">
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="assistantName">Nome do assistente</label>
          <input
            id="assistantName"
            className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white"
            value={assistantName}
            onChange={e => setAssistantName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="language">Idioma</label>
          <select
            id="language"
            className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="pt-BR">Português</option>
            <option value="en-US">Inglês</option>
            <option value="es-ES">Espanhol</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="tone">Tom de resposta</label>
          <select
            id="tone"
            className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white"
            value={tone}
            onChange={e => setTone(e.target.value)}
          >
            <option value="informal">Informal</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="notifications"
            type="checkbox"
            className="mr-2"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
          />
          <label htmlFor="notifications" className="text-gray-300">Ativar notificações</label>
        </div>
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="theme">Tema</label>
          <select
            id="theme"
            className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white"
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
          </select>
        </div>
        <button
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => alert("Histórico resetado!")}
        >
          Resetar histórico de conversa
        </button>
      </div>
    </div>
  );
}