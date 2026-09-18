import React from 'react';

export default function StatusBar() {
  return (
    <footer className="h-7 w-full bg-zinc-950 border-t border-zinc-800 flex items-center px-4 shrink-0 text-[11px] text-zinc-500 gap-6">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
        <span>Stockfish 16.1 (Depth 24)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
        <span>Lichess API: Connected</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Server Latency: 35ms</span>
      </div>
    </footer>
  );
}
