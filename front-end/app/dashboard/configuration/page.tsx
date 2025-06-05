"use client";

import { ConfigForm } from "@/components/dashboard/config/config-form"

export default function ConfigurationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <ConfigForm />
    </div>
  )
}