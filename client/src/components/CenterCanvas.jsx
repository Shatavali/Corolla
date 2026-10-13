import React, { useMemo } from 'react';
import Chessground from './Chessground';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, RotateCcw, FlipVertical2, Copy } from 'lucide-react';
import { useChessGame } from '../hooks/useChessGame';

export default function CenterCanvas() {
  const {
    fen,
    turnColor,
    dests,
    boardOrientation,
    isAtLatest,
    currentMoveIndex,
    totalMoves,
    onMove,
    goToStart,
    goBack,
    goForward,
    goToEnd,
    resetGame,
    flipBoard,
    copyFen,
  } = useChessGame();

  const canGoBack = currentMoveIndex > 0;
  const canGoForward = currentMoveIndex < totalMoves;

  // Build the chessground config object, memoized to avoid unnecessary re-renders
  const config = useMemo(() => ({
    fen,
    orientation: boardOrientation,
    turnColor,
    movable: {
      free: false,
      color: isAtLatest ? 'both' : undefined,  // Only allow moves at the latest position
      dests,
      showDests: true,
    },
    highlight: {
      lastMove: true,
      check: true,
    },
    animation: {
      enabled: true,
      duration: 200,
    },
    draggable: {
      enabled: isAtLatest,   // Disable drag when browsing history
      showGhost: true,
    },
    premovable: {
      enabled: false,
    },
    events: {
      move: onMove,
    },
  }), [fen, boardOrientation, turnColor, dests, onMove, isAtLatest]);

  return (
    <main className="flex-1 bg-zinc-900 flex flex-col relative overflow-hidden h-full">
      {/* Status Bar */}
      <div className="p-3 border-b border-zinc-800 text-xs text-zinc-400 font-semibold tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>LIVE BOARD — {turnColor === 'white' ? 'White' : 'Black'} to move</span>
          {!isAtLatest && (
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded font-bold tracking-wider">
              VIEWING MOVE {currentMoveIndex}/{totalMoves}
            </span>
          )}
        </div>
        <span className="text-zinc-600 text-[10px] tracking-widest">CHESSGROUND · LICHESS ENGINE</span>
      </div>

      {/* Board Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex gap-4 items-center">
          {/* Eval Bar */}
          <div className="h-[600px] w-8 bg-zinc-800 rounded flex flex-col overflow-hidden border border-zinc-700 relative shadow-md">
            <div className="flex-1 bg-zinc-200"></div>
            <div className="h-[38%] bg-zinc-900"></div>

            <div className="absolute top-2 w-full text-center text-[10px] text-zinc-800 font-bold z-10">+0.6</div>
            <div className="absolute bottom-2 w-full text-center text-[10px] text-zinc-300 font-bold z-10">+0.6</div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30 pointer-events-none"></div>
          </div>

          {/* Board + Controls Column */}
          <div className="flex flex-col gap-0">
            {/* Chessground Board Container — strict 600×600 square */}
            <div className="w-[600px] h-[600px] flex-shrink-0 rounded-t-sm shadow-2xl border-4 border-b-0 border-zinc-800/50 overflow-hidden">
              <Chessground contained={true} config={config} />
            </div>

            {/* ─── Lichess-Style Navigation Bar ─── */}
            <div className="w-[600px] flex items-center bg-zinc-800/90 border-4 border-t-2 border-zinc-800/50 rounded-b-sm backdrop-blur-sm">
              {/* Timeline Navigation */}
              <div className="flex items-center flex-1">
                <button
                  onClick={goToStart}
                  disabled={!canGoBack}
                  className={`flex-1 flex items-center justify-center py-2.5 transition-all duration-150 hover:bg-zinc-700/60 active:bg-zinc-600/60 ${
                    !canGoBack ? 'opacity-30 cursor-not-allowed' : 'text-zinc-300 cursor-pointer'
                  }`}
                  title="Go to start"
                >
                  <ChevronsLeft size={20} />
                </button>
                <button
                  onClick={goBack}
                  disabled={!canGoBack}
                  className={`flex-1 flex items-center justify-center py-2.5 transition-all duration-150 hover:bg-zinc-700/60 active:bg-zinc-600/60 ${
                    !canGoBack ? 'opacity-30 cursor-not-allowed' : 'text-zinc-300 cursor-pointer'
                  }`}
                  title="Go back one move"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goForward}
                  disabled={!canGoForward}
                  className={`flex-1 flex items-center justify-center py-2.5 transition-all duration-150 hover:bg-zinc-700/60 active:bg-zinc-600/60 ${
                    !canGoForward ? 'opacity-30 cursor-not-allowed' : 'text-zinc-300 cursor-pointer'
                  }`}
                  title="Go forward one move"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={goToEnd}
                  disabled={!canGoForward}
                  className={`flex-1 flex items-center justify-center py-2.5 transition-all duration-150 hover:bg-zinc-700/60 active:bg-zinc-600/60 ${
                    !canGoForward ? 'opacity-30 cursor-not-allowed' : 'text-zinc-300 cursor-pointer'
                  }`}
                  title="Go to latest move"
                >
                  <ChevronsRight size={20} />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-zinc-700/60"></div>

              {/* Utility Actions */}
              <div className="flex items-center">
                <button
                  onClick={flipBoard}
                  className="flex items-center justify-center px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60 active:bg-zinc-600/60 transition-all duration-150 cursor-pointer"
                  title="Flip board"
                >
                  <FlipVertical2 size={16} />
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60 active:bg-zinc-600/60 transition-all duration-150 cursor-pointer"
                  title="Reset game"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={copyFen}
                  className="flex items-center justify-center px-3 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60 active:bg-zinc-600/60 transition-all duration-150 cursor-pointer"
                  title="Copy FEN"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
