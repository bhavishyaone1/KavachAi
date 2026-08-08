import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Activity } from 'lucide-react';

export default function ResultSummary({ scanResult }) {
  if (!scanResult) return null;

  const {
    "Visual Deepfake Score": visualScore,
    "Voice Clone Score": voiceScore,
    "Lip-Sync Anomaly": syncScore,
    "Scam Probability": scamScore,
    "URL Risk": urlScore,
    "Document Risk": docScore
  } = scanResult;

  // Prepare chart data format
  const data = [
    { subject: 'Visual AI', score: visualScore || 0 },
    { subject: 'Voice Spoof', score: voiceScore || 0 },
    { subject: 'Timeline Drift', score: syncScore || 0 },
    { subject: 'NLP Scam', score: scamScore || 0 },
    { subject: 'URL Risk', score: urlScore || 0 },
    { subject: 'Doc Risk', score: docScore || 0 }
  ];

  return (
    <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-4 hover:border-[#3b82f6]/30 transition-all duration-300">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <Activity size={16} className="text-[#3b82f6] animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Forensic Vector Breakdown
        </span>
      </div>

      <div className="w-full h-[220px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }}
            />
            <Radar
              name="Threat Vector"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-3 text-[10px] text-white/50 border-t border-white/5 pt-3 font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6] opacity-60" />
          <span>Analyzed Confidence Radius</span>
        </div>
      </div>
    </div>
  );
}
