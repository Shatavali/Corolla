import React, { useState } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import CenterCanvas from './components/CenterCanvas';
import SidebarRight from './components/SidebarRight';
import StatusBar from './components/StatusBar';

function App() {
  const [boardTheme, setBoardTheme] = useState('Wood'); // 'Wood' or 'Green'

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <SidebarLeft />
        <CenterCanvas />
        <SidebarRight boardTheme={boardTheme} setBoardTheme={setBoardTheme} />
      </div>
      
      <StatusBar />
    </div>
  );
}

export default App;
