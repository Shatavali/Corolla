import React from 'react';
import { Target, Rocket, Move, Layers, AlertCircle, ChevronUp } from 'lucide-react';
import { strategicPlans } from '../data/mockChessData';

const iconMap = {
  target: Target,
  rocket: Rocket,
  move: Move,
  layers: Layers
};

export default function SidebarRight({ boardTheme, setBoardTheme }) {
  return (
    <aside className="w-[380px] h-full border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <span className="text-xs font-semibold text-zinc-400 tracking-wide">ANALYSIS & AI COACHING</span>
        <span className="text-zinc-500 cursor-pointer">...</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* AI Coach Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center justify-between">
            AI Coach (Conversational LLM)
          </h2>
          
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-[-4px]">
            <span>ASK THE COACH</span>
            <ChevronUp className="w-4 h-4" />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 leading-relaxed shadow-sm">
            <span className="text-indigo-400 font-semibold">Coach: </span>
            After analyzing move 7...d6?, this is a slight inaccuracy (+0.4 → +0.8). White gains better central control.
          </div>
          
          <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3 shadow-sm flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">
              <span className="font-bold">TACTICAL WARNING:</span> Critical Move-Order Sensitive Position.
            </p>
          </div>
          
          <input 
            type="text" 
            placeholder="Ask Coach: What are the main ideas here?" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2.5 px-3 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
        </div>
        
        <hr className="border-zinc-800" />
        
        {/* Plans & Ideas Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Plans & Ideas</h2>
          </div>
          
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-[-4px]">
            <span>STRATEGIC PLANS</span>
            <ChevronUp className="w-4 h-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {strategicPlans.map(plan => {
              const Icon = iconMap[plan.icon] || Target;
              return (
                <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col gap-2 hover:border-zinc-700 transition-colors cursor-pointer shadow-sm">
                  <div className="bg-zinc-800 w-7 h-7 rounded flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="text-xs text-zinc-300">
                    <span className="font-semibold">{plan.id}. {plan.title}</span><br/>
                    <span className="text-zinc-500">*{plan.description}*</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Board Themes Section */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-sm font-semibold text-zinc-100">Board Themes</h2>
          <div className="flex gap-3">
            <div 
              onClick={() => setBoardTheme('Wood')}
              className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${boardTheme === 'Wood' ? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-300 shadow-inner' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 shadow-sm'}`}
            >
              Wood
            </div>
            <div 
              onClick={() => setBoardTheme('Green')}
              className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${boardTheme === 'Green' ? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-300 shadow-inner' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 shadow-sm'}`}
            >
              Green
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
