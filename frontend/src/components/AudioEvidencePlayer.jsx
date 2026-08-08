import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Music, MessageSquare } from 'lucide-react';

export default function AudioEvidencePlayer({ 
  audioFile, 
  cloneScore, 
  reasons = [], 
  suspiciousText = "" 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!waveformRef.current || !audioFile) return;

    // Create WaveSurfer player instance
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgba(255, 255, 255, 0.15)',
      progressColor: '#3b82f6',
      cursorColor: '#3b82f6',
      barWidth: 2.5,
      barRadius: 2,
      height: 60,
      cursorWidth: 2,
      responsive: true
    });

    const audioUrl = URL.createObjectURL(audioFile);
    ws.load(audioUrl);
    wavesurferRef.current = ws;

    // Listeners
    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [audioFile]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 hover:border-[#3b82f6]/30 transition-all duration-300">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <Music size={16} className="text-[#3b82f6]" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Acoustic Signal Waveform
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Core WaveSurfer Container */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center justify-center border-none cursor-pointer shadow-md transition-all shrink-0"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          
          <div className="flex-1 flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{audioFile?.name || "Suspicious audio track"}</span>
            <span className="text-[10px] text-white/50">Waveform seeks enabled</span>
          </div>
        </div>

        {/* Waveform Ref Node */}
        <div 
          ref={waveformRef} 
          className="w-full py-2 bg-black/50 border border-white/5 rounded-xl px-4"
        />

        {/* Voice authenticity metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0f1422] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
              AI Voice Spoof Index
            </span>
            <span className={`text-xl font-bold ${cloneScore > 70 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {cloneScore}%
            </span>
          </div>

          <div className="bg-[#0f1422] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
              Signature Status
            </span>
            <span className={`text-xs font-bold uppercase ${cloneScore > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {cloneScore > 70 ? 'Synthetic Cloned Speech' : 'Bona-Fide Human Voice'}
            </span>
          </div>
        </div>

        {/* Transcript phrases highlighting */}
        {suspiciousText && (
          <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-left flex gap-3 items-start">
            <MessageSquare className="text-[#3b82f6] w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block mb-1">
                Acoustic Speech Transcript
              </span>
              <p className="text-xs text-white/70 italic leading-relaxed font-mono">
                "{suspiciousText}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
