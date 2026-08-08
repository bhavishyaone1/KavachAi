import React from 'react';
import { 
  Eye, 
  Activity, 
  Music, 
  FileText, 
  ShieldAlert, 
  Link, 
  Database, 
  Fingerprint,
  QrCode,
  AlertCircle
} from 'lucide-react';

export default function DetectionCard({ 
  type, // 'visual' | 'audio' | 'sync' | 'scam' | 'url' | 'document' | 'claim'
  score, 
  category, 
  explanation 
}) {
  
  const getCardDetails = () => {
    switch (type) {
      case 'visual':
        return {
          title: 'Visual Authenticity',
          icon: Eye,
          metricLabel: score > 60 ? 'Likely Synthesized' : 'Likely Authentic',
          severity: score > 70 ? 'danger' : score > 35 ? 'warning' : 'safe'
        };
      case 'audio':
        return {
          title: 'Voice Clone Detection',
          icon: Music,
          metricLabel: score > 70 ? 'Likely Synthetic' : 'Natural Speech Signature',
          severity: score > 70 ? 'danger' : score > 40 ? 'warning' : 'safe'
        };
      case 'sync':
        return {
          title: 'Lip Sync Alignment',
          icon: Fingerprint,
          metricLabel: score > 50 ? 'Anomalous speech delay' : 'Track Synchronized',
          severity: score > 50 ? 'danger' : 'safe'
        };
      case 'scam':
        return {
          title: 'Scam Detection',
          icon: ShieldAlert,
          metricLabel: category || 'Safe / Normal',
          severity: score > 70 ? 'danger' : score > 40 ? 'warning' : 'safe'
        };
      case 'url':
        return {
          title: 'Website Authenticity',
          icon: Link,
          metricLabel: score > 60 ? 'Phishing Domain Alert' : 'Safe Host Reputation',
          severity: score > 60 ? 'danger' : score > 20 ? 'warning' : 'safe'
        };
      case 'document':
        return {
          title: 'Document Forensics',
          icon: FileText,
          metricLabel: score > 50 ? 'Impersonation Indicators' : 'Verified layout signature',
          severity: score > 50 ? 'danger' : 'safe'
        };
      case 'claim':
        return {
          title: 'Claim Verification',
          icon: Database,
          metricLabel: score === 'CONTRADICTED' ? 'Contradicted Claim' : score === 'SUPPORTED' ? 'Supported Claim' : 'Unverified Fact',
          severity: score === 'CONTRADICTED' ? 'danger' : score === 'SUPPORTED' ? 'safe' : 'warning'
        };
      default:
        return {
          title: 'Forensic Indicator',
          icon: AlertCircle,
          metricLabel: 'Standard assessment active',
          severity: 'safe'
        };
    }
  };

  const meta = getCardDetails();
  const Icon = meta.icon;

  const getSeverityColors = (sev) => {
    if (sev === 'danger') return 'border-rose-500/20 bg-rose-500/5 text-rose-400';
    if (sev === 'warning') return 'border-amber-500/20 bg-amber-500/5 text-amber-400';
    return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400';
  };

  return (
    <div className={`p-5 rounded-2xl border bg-[#0d111a]/85 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.01] ${getSeverityColors(meta.severity)}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <Icon size={18} />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {meta.title}
          </h4>
        </div>
        
        {typeof score === 'number' && (
          <span className="text-xs font-extrabold font-mono">
            {score}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-wide">
          {meta.metricLabel}
        </span>
        <p className="text-[11px] text-white/60 leading-relaxed font-medium">
          {explanation}
        </p>
      </div>
    </div>
  );
}
