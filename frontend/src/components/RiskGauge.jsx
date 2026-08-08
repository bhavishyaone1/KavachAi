import React from 'react';
import { motion } from 'motion/react';

export default function RiskGauge({ score, verdict }) {
  // Determine severity style variables
  const getSeverityStyle = (v) => {
    const val = v ? v.toLowerCase() : '';
    if (val === 'critical') {
      return {
        colorClass: 'text-rose-500',
        strokeColor: '#f43f5e',
        glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
        bgPill: 'bg-rose-500/10 border-rose-500/30'
      };
    }
    if (val === 'high' || val === 'danger') {
      return {
        colorClass: 'text-red-500',
        strokeColor: '#ef4444',
        glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
        bgPill: 'bg-red-500/10 border-red-500/30'
      };
    }
    if (val === 'suspicious') {
      return {
        colorClass: 'text-amber-500',
        strokeColor: '#f59e0b',
        glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
        bgPill: 'bg-amber-500/10 border-amber-500/30'
      };
    }
    if (val === 'moderate' || val === 'medium') {
      return {
        colorClass: 'text-yellow-500',
        strokeColor: '#eab308',
        glowClass: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]',
        bgPill: 'bg-yellow-500/10 border-yellow-500/30'
      };
    }
    return {
      colorClass: 'text-emerald-500',
      strokeColor: '#10b981',
      glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      bgPill: 'bg-emerald-500/10 border-emerald-500/30'
    };
  };

  const style = getSeverityStyle(verdict);
  
  // SVG Ring Calculations
  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      {/* Outer circular chart container */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Base background ring */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active indicator ring */}
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke={style.strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Core Value Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-extrabold text-white tracking-tight"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {score}
          </motion.span>
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">
            Threat Index
          </span>
        </div>
      </div>

      {/* Severity pill banner */}
      <motion.div 
        className={`px-4 py-1.5 rounded-full border text-xs font-extrabold tracking-wider uppercase ${style.bgPill} ${style.colorClass}`}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {verdict} Risk
      </motion.div>
    </div>
  );
}
