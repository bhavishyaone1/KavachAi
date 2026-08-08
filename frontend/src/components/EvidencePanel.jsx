import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Link as LinkIcon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EvidencePanel({ scanResult }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  if (!scanResult) return null;

  const {
    "Suspicious Text": suspiciousText,
    "Suspicious URLs": suspiciousUrls,
    "Suspicious Identifiers": suspiciousIdentifiers,
    "Suspicious Video Frames": suspiciousFrames,
    "Suspicious Timestamps": suspiciousTimestamps,
    "Metadata Findings": metadataFindings,
    "Threat Intelligence Results": threatIntel,
    "Reasons": reasons
  } = scanResult;

  const evidenceItems = [
    {
      id: 'reasons',
      label: 'Identified Risk Vectors',
      badge: reasons?.length || 0,
      icon: AlertTriangle,
      color: 'text-rose-400',
      content: reasons && reasons.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {reasons.map((r, idx) => (
            <div key={idx} className="text-xs text-rose-400 bg-rose-950/10 border-l border-rose-500 py-2.5 px-3 rounded-r-md leading-relaxed font-medium">
              {r}
            </div>
          ))}
        </div>
      ) : null
    },
    {
      id: 'scam_phrases',
      label: 'Extracted Scam Content / OCR Text',
      badge: suspiciousText ? 1 : 0,
      icon: AlertCircle,
      color: 'text-amber-400',
      content: suspiciousText ? (
        <div className="mt-2 text-xs text-white/70 bg-black/40 p-4 rounded-xl border border-white/5 font-mono leading-relaxed">
          {suspiciousText}
        </div>
      ) : null
    },
    {
      id: 'phish_urls',
      label: 'Flagged Domain Identifiers',
      badge: suspiciousUrls?.length || 0,
      icon: LinkIcon,
      color: 'text-blue-400',
      content: suspiciousUrls && suspiciousUrls.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {suspiciousUrls.map((u, idx) => (
            <div key={idx} className="text-xs text-blue-400 bg-blue-950/10 border-l border-blue-500 py-2.5 px-3 rounded-r-md font-mono">
              {u}
            </div>
          ))}
        </div>
      ) : null
    },
    {
      id: 'identifiers',
      label: 'Suspicious VPAs / Phone Tags',
      badge: suspiciousIdentifiers?.length || 0,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      content: suspiciousIdentifiers && suspiciousIdentifiers.length > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          {suspiciousIdentifiers.map((idVal, idx) => (
            <div key={idx} className="text-xs text-emerald-400 bg-emerald-950/10 border-l border-emerald-500 py-2.5 px-3 rounded-r-md font-mono">
              {idVal}
            </div>
          ))}
        </div>
      ) : null
    },
    {
      id: 'metadata',
      label: 'Metadata Anomalies',
      badge: metadataFindings ? 1 : 0,
      icon: AlertCircle,
      color: 'text-gray-400',
      content: metadataFindings ? (
        <div className="mt-2 text-xs text-white/70 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed font-mono">
          {metadataFindings}
        </div>
      ) : null
    },
    {
      id: 'threat_intel',
      label: 'Threat Intelligence Feeds',
      badge: threatIntel ? 1 : 0,
      icon: AlertTriangle,
      color: 'text-indigo-400',
      content: threatIntel ? (
        <div className="mt-2 text-xs text-white/70 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed font-mono">
          {threatIntel}
        </div>
      ) : null
    }
  ];

  // Filter out items that have no badge/content
  const activeItems = evidenceItems.filter(item => item.badge > 0);

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <AlertCircle size={16} className="text-[#3b82f6]" />
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">
          Why was this flagged? (Evidence)
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {activeItems.map((item) => {
          const isOpen = openSection === item.id;
          const ItemIcon = item.icon;
          
          return (
            <div 
              key={item.id}
              className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full flex justify-between items-center px-5 py-4 bg-transparent border-none cursor-pointer text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ItemIcon className={`${item.color} shrink-0`} size={16} />
                  <span className="text-xs font-bold text-white/80 tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-bold font-mono">
                    {item.badge}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-white/40" />
                ) : (
                  <ChevronDown size={16} className="text-white/40" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/5">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
