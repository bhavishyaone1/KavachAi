import React, { useMemo } from 'react';
import { ReactFlow, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ConnectedEvidence({ scanResult }) {
  const overallRisk = scanResult ? scanResult["Overall Fraud Risk"] : 0;

  // Compile active threats
  const threats = useMemo(() => {
    if (!scanResult) return [];

    const {
      "Visual Deepfake Score": visualScore,
      "Voice Clone Score": voiceScore,
      "Lip-Sync Anomaly": syncScore,
      "Scam Probability": scamScore,
      "URL Risk": urlScore,
      "QR Risk": qrScore,
      "Claim Verification Result": claimResult
    } = scanResult;

    const list = [];
    if (visualScore > 50) list.push({ label: 'Visual Deepfake', score: `${visualScore}%` });
    if (voiceScore > 50) list.push({ label: 'Voice Clone', score: `${voiceScore}%` });
    if (syncScore > 50) list.push({ label: 'A/V Sync Drift', score: `${syncScore}%` });
    if (scamScore > 50) list.push({ label: 'NLP Scam Script', score: `${scamScore}%` });
    if (urlScore > 50) list.push({ label: 'Phishing Domain', score: `${urlScore}%` });
    if (qrScore > 50) list.push({ label: 'UPI QR Payee', score: 'Flagged' });
    if (claimResult === 'CONTRADICTED') list.push({ label: 'RAG Citation Alert', score: 'Contradicted' });
    return list;
  }, [scanResult]);

  // Build React Flow nodes and edges dynamically based on active threats
  const { nodes, edges } = useMemo(() => {
    if (!scanResult) return { nodes: [], edges: [] };

    const overallRisk = scanResult["Overall Fraud Risk"];
    const nodesList = [];
    const edgesList = [];
    
    // Add threat source nodes
    threats.forEach((threat, idx) => {
      nodesList.push({
        id: `threat-${idx}`,
        position: { x: 20, y: 15 + idx * 60 },
        data: { label: `${threat.label} (${threat.score})` },
        style: {
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          color: '#f43f5e',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '9px',
          width: 140,
          textAlign: 'center',
          boxShadow: '0 0 10px rgba(244, 63, 94, 0.1)'
        }
      });

      edgesList.push({
        id: `edge-${idx}`,
        source: `threat-${idx}`,
        target: 'fusion-core',
        animated: true,
        style: { stroke: '#f43f5e', strokeWidth: 1.5 }
      });
    });

    // Add central fusion node
    const fusionY = Math.max(15, (threats.length - 1) * 30);
    nodesList.push({
      id: 'fusion-core',
      position: { x: 220, y: fusionY },
      data: { label: 'AI FUSION' },
      style: {
        background: 'var(--bg-card)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        color: '#3b82f6',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '10px',
        width: 100,
        textAlign: 'center',
        boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
      }
    });

    // Add risk output node
    nodesList.push({
      id: 'verdict-node',
      position: { x: 380, y: fusionY },
      data: { label: `${overallRisk}% RISK` },
      style: {
        background: 'rgba(244, 63, 94, 0.12)',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        color: '#f43f5e',
        borderRadius: '12px',
        fontWeight: 'extrabold',
        fontSize: '11px',
        width: 100,
        textAlign: 'center',
        boxShadow: '0 0 15px rgba(244, 63, 94, 0.3)'
      }
    });

    edgesList.push({
      id: 'edge-core-verdict',
      source: 'fusion-core',
      target: 'verdict-node',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    });

    return { nodes: nodesList, edges: edgesList };
  }, [threats, scanResult]);

  if (!scanResult) return null;

  // If no threats exist, render safe status
  if (threats.length === 0) {
    return (
      <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg text-center">
        <ShieldCheck className="text-emerald-500 w-10 h-10 mx-auto mb-3" />
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          No Fused Vectors Flagged
        </span>
        <p className="text-[11px] text-white/50 mt-1 max-w-[280px] mx-auto leading-normal">
          All analyzed modality metrics (audio, image, document, text, link) remain within legitimate boundary thresholds.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-5 hover:border-[#3b82f6]/30 transition-all duration-300">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <AlertTriangle size={16} className="text-[#3b82f6]" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Connected Evidence Flowchart
        </span>
      </div>

      <p className="text-[11px] text-white/50 leading-relaxed font-medium">
        Hover or inspect active threat correlation node signals below:
      </p>

      {/* React Flow Container */}
      <div className="w-full border border-white/5 rounded-xl bg-black/30 overflow-hidden" style={{ height: `${Math.max(160, threats.length * 60 + 30)}px` }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          panOnDrag={false}
          zoomOnScroll={false}
          preventScrolling={true}
          nodesConnectable={false}
          nodesDraggable={false}
          elementsSelectable={false}
        />
      </div>

      {/* Conclusion banner */}
      <div className="mt-2 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-semibold">
        <span className="text-white/50">Fused Risk Outcome:</span>
        <span className="text-rose-400 font-mono font-extrabold uppercase">
          {overallRisk}% Risk Index
        </span>
      </div>
    </div>
  );
}
