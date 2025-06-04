"use client";

import React, { useState } from "react";

export default function CalendarPage() {
  const [showWeekends, setShowWeekends] = useState(true);
  const [defaultView, setDefaultView] = useState("month");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Calendário</h1>
      <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center space-y-6 w-full max-w-xl mx-auto">
        <span className="text-lg text-gray-300 mb-2">
          Em breve você poderá visualizar e gerenciar seus compromissos aqui!
        </span>
        {/* Configurações do calendário */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center">
            <input
              id="showWeekends"
              type="checkbox"
              className="mr-2"
              checked={showWeekends}
              onChange={e => setShowWeekends(e.target.checked)}
            />
            <label htmlFor="showWeekends" className="text-gray-300">
              Mostrar finais de semana
            </label>
          </div>
          <div>
            <label htmlFor="defaultView" className="block mb-1 text-gray-300">
              Visualização padrão
            </label>
            <select
              id="defaultView"
              className="w-full rounded bg-gray-900 border border-gray-700 px-3 py-2 text-white"
              value={defaultView}
              onChange={e => setDefaultView(e.target.value)}
            >
              <option value="month">Mensal</option>
              <option value="week">Semanal</option>
              <option value="day">Diária</option>
            </select>
          </div>
        </div>
        {/* Placeholder do calendário */}
        <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
          <span className="text-gray-500">[Calendário Placeholder]</span>
        </div>
      </div>
    </div>
  );
}