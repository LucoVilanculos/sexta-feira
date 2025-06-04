"use client"

import React, { createContext, useContext, useState } from "react";

interface VoiceContextProps {
    muted: boolean;
    toggleMute: () => void;
}

const VoiceContext = createContext<VoiceContextProps | null>(null)

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [muted, setMuted] = useState(false);
    const toggleMute = () => setMuted(!muted) 

    return (
        <VoiceContext.Provider value={{ muted, toggleMute }}>
            {children}
        </VoiceContext.Provider>

    )
}
export const useVoice = () => {
    const ctx = useContext(VoiceContext);
    if (!ctx) {
        throw new Error("VoiceContext not found.");
    }
}