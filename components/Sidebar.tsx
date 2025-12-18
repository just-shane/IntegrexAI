
import React from 'react';
import { Feature } from '../types';

interface SidebarProps {
  onFeatureSelect: (feature: Feature) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFeatureSelect }) => {
  const machineData = {
    model: "Integrex i-200S",
    control: "Matrix",
    uptime: "142h 22m",
    lastService: "2024-03-15"
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full hidden lg:flex">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
          <h1 className="text-xl font-bold tracking-tight text-white">IntegrexAI</h1>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">Connected Machine</p>
            <p className="text-sm font-bold text-orange-400">{machineData.model}</p>
            <p className="text-xs text-slate-400 mt-1">Controller: {machineData.control}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-center">
              <p className="text-[10px] text-slate-500 uppercase">Uptime</p>
              <p className="text-sm font-mono text-green-400">ONLINE</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-center">
              <p className="text-[10px] text-slate-500 uppercase">Spindle</p>
              <p className="text-sm font-mono text-slate-300">IDLE</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold uppercase text-slate-500">Expert Modules</p>
        {Object.values(Feature).map((feature) => (
          <button
            key={feature}
            onClick={() => onFeatureSelect(feature)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group flex items-center space-x-3"
          >
            <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-orange-500 transition-colors" />
            <span className="text-sm text-slate-300 font-medium">{feature}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Maintenance Status</span>
          <span className="text-green-400">92%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
        </div>
        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition-colors">
          VIEW LOGS
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
