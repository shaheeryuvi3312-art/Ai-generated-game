import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Gamepad2, Trophy, RotateCcw, Activity, Zap, Cpu, Terminal } from 'lucide-react';
import { useSnake } from './hooks/useSnake';
import { Track } from './types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'DIGITAL PULSE',
    artist: 'NeuralBeat AI',
    cover: 'https://picsum.photos/seed/synthwave/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'NEON HORIZON',
    artist: 'Cyber Runner',
    cover: 'https://picsum.photos/seed/techno/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'GLITCH GARDEN',
    artist: 'Buffer Void',
    cover: 'https://picsum.photos/seed/lofi/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function App() {
  const { snake, food, score, gameState, GRID_SIZE, resetGame } = useSnake();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState('00:00:00');

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col overflow-hidden border-4 border-[#1a1a1a] shadow-2xl relative font-mono selection:bg-neon-cyan selection:text-black">
      {/* Header Navigation */}
      <header className="h-14 border-b border-neon-cyan/30 flex items-center justify-between px-6 bg-[#0a0a0a] z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-2 border-neon-cyan rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-neon-pink animate-pulse"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter neon-text-cyan">
            SYNTH_SNAKE v2.0
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest text-neon-cyan/60">
          <div className="flex flex-col">
            <span>System Status</span>
            <span className="text-neon-green">● OPERATIONAL</span>
          </div>
          <div className="flex flex-col">
            <span>Network</span>
            <span className="text-neon-pink">9ms Latency</span>
          </div>
          <div className="flex flex-col text-right">
            <span>Session Time</span>
            <span className="text-white">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Control Deck */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {/* Left Panel: Music Player */}
        <aside className="w-72 hidden lg:flex flex-col gap-4 animate-in fade-in slide-in-from-left duration-700">
          <div className="bg-[#0a0a0a] border border-neon-cyan/20 p-4 flex-1 flex flex-col overflow-hidden group">
            <div className="text-[10px] text-neon-cyan/50 mb-3 tracking-widest uppercase flex items-center gap-2">
              <Activity size={12} className="text-neon-cyan" />
              Now Playing
            </div>
            
            <div className="w-full aspect-square bg-[#111] border border-neon-cyan/30 mb-4 relative overflow-hidden group/cover">
              <motion.img 
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={currentTrack.cover} 
                className="w-full h-full object-cover grayscale brightness-75 group-hover/cover:grayscale-0 group-hover/cover:brightness-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border-2 border-neon-pink/40 rounded-full animate-ping opacity-20"></div>
                <div className="w-40 h-40 border border-neon-cyan/20 rounded-full absolute"></div>
              </div>
            </div>

            <div className="mb-6 h-12 overflow-hidden">
              <h2 className="text-neon-cyan text-lg font-bold truncate leading-tight uppercase">{currentTrack.title}</h2>
              <p className="text-neon-pink text-xs uppercase tracking-wider">{currentTrack.artist}</p>
            </div>
            
            {/* Playlist */}
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
              {DUMMY_TRACKS.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(i)}
                  className={`w-full p-2 text-left border-l-2 transition-all group/item ${
                    currentTrackIndex === i 
                      ? 'bg-neon-cyan/10 border-neon-cyan' 
                      : 'hover:bg-white/5 border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="truncate pr-2">0{i+1}. {track.title}</span>
                    <span className={`${currentTrackIndex === i ? 'text-neon-cyan' : 'text-white/40'}`}>
                      {currentTrackIndex === i && isPlaying ? 'PLAYING' : 'READY'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel: Snake Game */}
        <section className="flex-1 flex flex-col gap-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#000] border-2 border-neon-pink/40 flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div 
              className="relative grid gap-px border border-white/5 bg-[#050505]/40 backdrop-blur-sm z-10"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: 'min(80vw, 400px)',
                height: 'min(80vw, 400px)'
              }}
            >
              {gameState !== 'IDLE' && (
                <>
                  {snake.map((segment, i) => (
                    <div
                      key={`${segment.x}-${segment.y}-${i}`}
                      className={`absolute ${i === 0 ? 'bg-neon-green shadow-[0_0_12px_#00ff41] border border-white/40 z-20' : 'bg-neon-green/60 shadow-[0_0_8px_#00ff41] z-10'}`}
                      style={{
                        left: `${segment.x * 100 / GRID_SIZE}%`,
                        top: `${segment.y * 100 / GRID_SIZE}%`,
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                      }}
                    />
                  ))}
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute bg-red-500 shadow-[0_0_10px_#ff0000] rounded-sm z-30"
                    style={{
                      left: `${food.x * 100 / GRID_SIZE}%`,
                      top: `${food.y * 100 / GRID_SIZE}%`,
                      width: `${100 / GRID_SIZE}%`,
                      height: `${100 / GRID_SIZE}%`,
                    }}
                  />
                </>
              )}

              {/* Game Over Overlay */}
              {gameState === 'GAMEOVER' && (
                <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-5xl font-black mb-4 neon-text-pink tracking-tighter uppercase">CRITICAL_FAILURE</h2>
                  <p className="text-xl font-mono mb-8 neon-text-cyan leading-none">SCORE: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-3 px-8 py-3 bg-neon-pink text-black font-bold uppercase transition-transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw size={18} />
                    REBOOT PROCESS
                  </button>
                </div>
              )}

              {/* Start Overlay */}
              {gameState === 'IDLE' && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 border-2 border-neon-cyan flex items-center justify-center mb-6 bg-neon-cyan/10">
                    <Gamepad2 size={32} className="text-neon-cyan" />
                  </div>
                  <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase neon-text-cyan">
                    INITIATE_GAME
                  </h1>
                  <p className="text-white/40 text-xs mb-8 tracking-widest uppercase">System ready for input sequence</p>
                  <button 
                    onClick={resetGame}
                    className="px-10 py-4 border-2 border-neon-cyan text-neon-cyan font-bold uppercase tracking-[0.3em] text-xs hover:bg-neon-cyan hover:text-black transition-all"
                  >
                    Load Engine
                  </button>
                </div>
              )}
            </div>
            
            {/* Overlay Stats */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-neon-pink tracking-widest">Score</span>
                <span className="text-3xl font-bold text-white leading-none tracking-tight">{score}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase text-neon-cyan tracking-widest">Hi-Score</span>
                <span className="text-3xl font-bold text-white/40 leading-none tracking-tight">0000</span>
              </div>
            </div>
            
            {/* Controls Help */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="px-2 py-1 border border-white/20 bg-black/80 text-[9px] text-white/50 tracking-wider">[↑] UP</div>
              <div className="px-2 py-1 border border-white/20 bg-black/80 text-[9px] text-white/50 tracking-wider">[←] LEFT</div>
              <div className="px-2 py-1 border border-white/20 bg-black/80 text-[9px] text-white/50 tracking-wider">[↓] DOWN</div>
              <div className="px-2 py-1 border border-white/20 bg-black/80 text-[9px] text-white/50 tracking-wider">[→] RIGHT</div>
            </div>
          </div>

          {/* Music Controls Sub-Bar */}
          <div className="h-24 bg-[#0a0a0a] border border-neon-cyan/20 flex items-center px-4 md:px-8 justify-between shrink-0">
            <div className="hidden sm:flex gap-10">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-neon-cyan/60 tracking-widest">BPM</span>
                <span className="text-xl font-bold">128</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-neon-cyan/60 tracking-widest">KEY</span>
                <span className="text-xl font-bold uppercase">Am</span>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
               <button 
                onClick={handlePrev}
                className="text-white/60 hover:text-neon-cyan transition-colors"
              >
                 <SkipBack size={20} />
               </button>
               <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-neon-cyan text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
              >
                 {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
               </button>
               <button 
                onClick={handleNext}
                className="text-white/60 hover:text-neon-cyan transition-colors"
              >
                 <SkipForward size={20} />
               </button>
            </div>

            <div className="flex items-center gap-4 max-w-[120px] md:max-w-none">
              <Volume2 size={16} className="text-neon-cyan flex-shrink-0" />
              <div className="w-24 md:w-32 h-1 bg-[#1a1a1a] relative rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-3/4 bg-neon-cyan shadow-[0_0_8px_#00f3ff]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Diagnostics */}
        <aside className="w-56 hidden xl:flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-[#0a0a0a] border border-neon-pink/20 p-4 flex-1 flex flex-col">
            <div className="text-[10px] text-neon-pink/50 mb-4 tracking-widest uppercase flex items-center gap-2">
              <Cpu size={12} />
              Engine Load
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[9px] mb-1 font-bold tracking-tighter">
                  <span>GPU_THROUGHPUT</span>
                  <span className="text-neon-pink">84%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-pink w-[84%] shadow-[0_0_5px_#ff00e5]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] mb-1 font-bold tracking-tighter">
                  <span>AUDIO_BUFFER</span>
                  <span className="text-neon-cyan">12%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan w-[12%] shadow-[0_0_5px_#00f3ff]"></div>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-white/5 flex flex-col flex-1 min-h-0">
                <div className="text-[10px] text-white/20 flex items-center gap-2 mb-2 uppercase">
                  <Terminal size={10} />
                  Syslog
                </div>
                <div className="text-[9px] text-white/40 leading-relaxed font-mono overflow-hidden custom-scrollbar">
                  [12:04:12] TRACK_SYNCED<br/>
                  [12:04:15] COLLISION_ON<br/>
                  [12:04:22] POINT_ADD (+100)<br/>
                  [12:04:30] SPEED_INC (1.2x)<br/>
                  [12:04:45] BUFFER_READY
                </div>
              </div>
            </div>
          </div>
          <div className="h-24 bg-neon-pink/5 border border-neon-pink/30 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-neon-pink/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[10px] text-neon-pink/60 uppercase mb-1 font-black tracking-[0.2em]">Multiplier</span>
            <span className="relative text-3xl font-black italic text-neon-pink neon-text-pink">x2.5</span>
          </div>
        </aside>
      </main>

      {/* Bottom Bar Info */}
      <footer className="h-8 bg-neon-cyan text-black text-[9px] font-bold px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex gap-6 uppercase tracking-wider">
          <span className="hidden sm:inline">Session: 0xFF021A</span>
          <span>Buffer: Stable</span>
          <span className="hidden md:inline">Frequency: 44.1kHz</span>
        </div>
        <div className="flex gap-4 uppercase tracking-wider">
          <span className="hidden sm:inline">DEVICES: [02]</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span>LATENCY_STABLE</span>
          </div>
        </div>
      </footer>

      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={handleNext}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 243, 255, 0.2);
        }
      `}} />
    </div>
  );
}
