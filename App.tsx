
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { Feature } from './types';

const App: React.FC = () => {
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>();

  const handleFeatureSelect = (feature: Feature) => {
    const prompts: Record<Feature, string> = {
      [Feature.MAZATROL]: "Can you explain how to set up a BAR OUT unit in Mazatrol Matrix?",
      [Feature.GCODE]: "What is the G-code for B-axis indexing to 45 degrees on an Integrex?",
      [Feature.TOOLING]: "What are the recommended cutting parameters for machining 316 Stainless Steel with a 1/2 inch end mill on the milling spindle?",
      [Feature.MAINTENANCE]: "How do I troubleshoot Mazak Alarm 200: Thermal Trip?"
    };
    
    setPendingPrompt(prompts[feature]);
    // Reset after a tiny delay so ChatInterface sees the change
    setTimeout(() => setPendingPrompt(undefined), 100);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden selection:bg-orange-500/30">
      <Sidebar onFeatureSelect={handleFeatureSelect} />
      
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header - Mobile Only or Global Title Bar */}
        <header className="lg:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-bold">M</div>
            <span className="font-bold text-white uppercase tracking-tight">IntegrexAI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-slate-400 font-mono">LIVE</span>
          </div>
        </header>

        <ChatInterface initialMessage={pendingPrompt} />
        
        {/* Floating status indicator for desktop */}
        <div className="absolute top-4 right-4 hidden lg:flex items-center space-x-4">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-300">SYSTEM READY</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Integrex i-200S</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
