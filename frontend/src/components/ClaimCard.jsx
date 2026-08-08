import React from 'react';
import { Database, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ClaimCard({ 
  verdict, 
  reasons = [], 
  sources = [] 
}) {
  const isContradicted = verdict === "CONTRADICTED";
  const isSupported = verdict === "SUPPORTED";

  const getStatusDetails = () => {
    if (isContradicted) {
      return {
        label: 'Contradicted Claim',
        colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: AlertTriangle
      };
    }
    if (isSupported) {
      return {
        label: 'Supported Factual Claim',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: ShieldCheck
      };
    }
    return {
      label: 'Unverified Claim',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle
    };
  };

  const status = getStatusDetails();
  const StatusIcon = status.icon;

  return (
    <div className={`p-6 rounded-2xl border ${status.colorClass} flex flex-col gap-4 shadow-lg hover:scale-[1.01] transition-all duration-300`}>
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Database size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Regulatory RAG Verification
          </span>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40">
          {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-start">
          <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs text-white/80 leading-relaxed font-semibold">
            {reasons.find(r => r.includes('RAG Match')) || 
             (isContradicted 
               ? "Claimed government scheme or verification notice contradicts official CERT-In or RBI database advisories."
               : "Claim details match registered public warnings.")}
          </p>
        </div>
      </div>

      {/* Sources links */}
      {sources.length > 0 && (
        <div className="mt-2 border-t border-white/5 pt-4 flex flex-col gap-2">
          <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
            Authoritative Sources / Reference Links
          </span>
          <div className="flex flex-col gap-1.5">
            {sources.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#3b82f6] hover:text-white transition-colors flex items-center gap-1.5 no-underline font-mono truncate"
              >
                <ExternalLink size={12} />
                <span className="truncate">{url}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
