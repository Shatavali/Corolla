import React, { useRef, useEffect } from 'react';
import { Chessground as NativeChessground } from '@lichess-org/chessground';
import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.brown.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';

/**
 * A custom React wrapper for the official vanilla Lichess Chessground library.
 */
export default function Chessground({
  config,
  onMove
}) {
  const boardRef = useRef(null);
  const cgInstance = useRef(null);
  const onMoveRef = useRef(onMove);

  // Keep ref synchronized with the latest callback
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    if (boardRef.current && !cgInstance.current) {
      // Initialize on mount
      cgInstance.current = NativeChessground(boardRef.current, {
        ...config,
        events: {
          ...config?.events,
          move: (orig, dest, capturedPiece) => {
            if (config?.events?.move) {
              config.events.move(orig, dest, capturedPiece);
            }
            if (onMoveRef.current) {
              onMoveRef.current(orig, dest);
            }
          }
        }
      });
    } else if (cgInstance.current && config) {
      // Update config on subsequent renders
      cgInstance.current.set(config);
    }
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cgInstance.current) {
        cgInstance.current.destroy();
        cgInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={boardRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
}
