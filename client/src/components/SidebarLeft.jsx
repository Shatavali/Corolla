import React from 'react';
import { ChevronDown, ChevronRight, LayoutGrid, Clock, GitBranch, TerminalSquare, Settings, HelpCircle } from 'lucide-react';
import { pgnMoves } from '../data/mockChessData';

export default function SidebarLeft() {
  return (
    <div className="flex h-full shrink-0">
      {/* Thin Icon Bar */}
      <div className="w-12 h-full border-r border-zinc-800 bg-zinc-950 flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col gap-4">
          <div className="p-2 bg-indigo-600 rounded-md cursor-pointer text-white">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
            <Clock className="w-5 h-5" />
          </div>
          <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
            <GitBranch className="w-5 h-5" />
          </div>
          <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
            <TerminalSquare className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
            <Settings className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      {/* Main Panel */}
      <aside className="w-[260px] h-full border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="flex flex-col gap-1 p-2 border-b border-zinc-800">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 px-2 py-1.5">
            <span>EXPLORER & REPERTOIRE</span>
            <span className="cursor-pointer">...</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-4">
          {/* Opening Tree Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-sm text-zinc-300 py-1 cursor-pointer">
              <ChevronDown className="w-4 h-4" />
              <span>Opening Tree</span>
            </div>
            <div className="pl-2 ml-2 flex flex-col gap-1 border-l border-zinc-800 mt-1">
              <div className="flex items-center gap-1 text-sm text-zinc-300 py-1 cursor-pointer">
                <ChevronDown className="w-4 h-4" />
                <span>Sicilian Defense</span>
              </div>
              <div className="pl-4 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm text-zinc-300 py-1 cursor-pointer">
                  <ChevronDown className="w-4 h-4" />
                  <span>Najdorf Variation</span>
                </div>
                <div className="pl-4 flex flex-col gap-1 mt-1">
                  <div className="text-sm bg-indigo-600/20 text-indigo-300 py-1.5 px-2 rounded cursor-pointer border border-indigo-500/30">
                    English Attack
                  </div>
                  <div className="flex items-center gap-1 text-sm text-zinc-400 py-1.5 px-2 cursor-pointer hover:bg-zinc-900 rounded">
                    <ChevronRight className="w-3 h-3" />
                    <span>Poisoned Pawn</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-zinc-300 py-1 mt-2 cursor-pointer hover:bg-zinc-900 rounded px-1">
              <ChevronRight className="w-4 h-4" />
              <span>Saved Tabiya</span>
            </div>
          </div>

          {/* PGN Section */}
          <div className="flex flex-col border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between text-sm text-zinc-300 py-1 px-1 cursor-pointer hover:bg-zinc-900 rounded">
              <div className="flex items-center gap-1">
                <ChevronDown className="w-4 h-4" />
                <span>PGN</span>
              </div>
              <span className="text-zinc-500">...</span>
            </div>
            <div className="pl-5 mt-1 text-sm text-zinc-400 flex flex-col gap-1.5">
              {pgnMoves.map((move, i) => (
                <div key={i} className="hover:text-zinc-200 cursor-pointer">{move}</div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
