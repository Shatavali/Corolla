import React from 'react';
import { Search, User, Bell, Settings, Hexagon } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-12 w-full bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Hexagon className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
        <h1 className="text-sm font-bold tracking-widest text-zinc-100">
          COROLLA <span className="text-indigo-400">CHESS</span>
        </h1>
      </div>
      
      <div className="flex-1 flex justify-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search Openings or AI Analysis (Cmd+K)" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-zinc-400">
        <button className="hover:text-zinc-100 transition-colors"><User className="w-4 h-4" /></button>
        <button className="hover:text-zinc-100 transition-colors"><Bell className="w-4 h-4" /></button>
        <button className="hover:text-zinc-100 transition-colors"><Settings className="w-4 h-4" /></button>
      </div>
    </header>
  );
}
