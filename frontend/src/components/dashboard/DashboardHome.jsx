import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export default function DashboardHome({ historyList = [], onSelectHistory, onNavigate }) {
  
  // 1. Core Analytics Metrics
  const stats = useMemo(() => {
    const totalScans = historyList.length + 184; // seed baseline + session logs
    const avgRisk = historyList.length > 0 
      ? Math.round(historyList.reduce((acc, h) => acc + h.score, 0) / historyList.length)
      : 42;
    const criticalAlerts = historyList.filter(h => h.score > 70).length + 14;

    return { totalScans, avgRisk, criticalAlerts };
  }, [historyList]);

  // 2. Risk Distribution Bar Chart Data
  const riskBarData = useMemo(() => {
    // Count session risks
    let low = 112, mod = 42, susp = 18, high = 8, crit = 4;
    historyList.forEach(h => {
      if (h.score >= 81) crit++;
      else if (h.score >= 61) high++;
      else if (h.score >= 41) susp++;
      else if (h.score >= 21) mod++;
      else low++;
    });

    return [
      { name: 'Low', count: low, color: '#10b981' },
      { name: 'Moderate', count: mod, color: '#eab308' },
      { name: 'Suspicious', count: susp, color: '#f59e0b' },
      { name: 'High', count: high, color: '#ef4444' },
      { name: 'Critical', count: crit, color: '#f43f5e' }
    ];
  }, [historyList]);

  // 3. Modality Distribution Pie Chart Data
  const modalityPieData = [
    { name: 'Visual', value: 45, color: '#3b82f6' },
    { name: 'Acoustic', value: 25, color: '#06b6d4' },
    { name: 'Text NLP', value: 15, color: '#10b981' },
    { name: 'Links', value: 10, color: '#f59e0b' },
    { name: 'PDF Docs', value: 5, color: '#6366f1' }
  ];

  // 4. Activity Line Chart Data
  const activityLineData = [
    { day: '08-01', volume: 18 },
    { day: '08-02', volume: 24 },
    { day: '08-03', volume: 15 },
    { day: '08-04', volume: 32 },
    { day: '08-05', volume: stats.totalScans - 184 + 38 } // links daily stats
  ];

  // 5. Filter high risk sessions list
  const criticalThreats = useMemo(() => {
    return historyList.filter(h => h.score > 70).slice(0, 4);
  }, [historyList]);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header section */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <span className="text-[#3b82f6] font-bold text-xs uppercase tracking-widest block mb-1">
            SOC INTELLIGENCE CENTER
          </span>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">
            Threat Landscape Dashboard
          </h2>
        </div>

        <Button
          onClick={() => onNavigate('workspace')}
          variant="default"
          size="sm"
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>Launch Scanner</span>
        </Button>
      </div>

      {/* Core Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Scans Audited', val: stats.totalScans, sub: 'All modalities fused', icon: Layers },
          { title: 'Average Risk index', val: `${stats.avgRisk}%`, sub: 'Medium severity threshold', icon: TrendingUp },
          { title: 'Critical Detections', val: stats.criticalAlerts, sub: 'Immediate threat alerts', icon: ShieldAlert },
          { title: 'SOC Engine Uptime', val: '99.98%', sub: 'Forensic pipelines active', icon: Clock }
        ].map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  {card.title}
                </span>
                <CardIcon size={14} className="text-[#3b82f6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-white tracking-tight">{card.val}</span>
                <span className="text-[10px] text-white/40 mt-1">{card.sub}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Risk Distribution Bar Chart */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Risk Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}
                  itemStyle={{ color: '#3b82f6', fontSize: 10 }}
                />
                <Bar dataKey="count">
                  {riskBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modality Donut Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Modality Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={4}
                  dataKey="value"
                >
                  {modalityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'white', fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-extrabold text-white">5</span>
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Pipelines</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Line Chart */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Daily Audit Activities (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ background: '#0d111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6', fontSize: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Critical Threats Alert Feed */}
      {criticalThreats.length > 0 && (
        <Card className="w-full border-rose-500/20 bg-rose-500/[0.01]">
          <CardHeader className="flex flex-row justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-500 animate-pulse" size={16} />
              <CardTitle className="text-rose-500">Critical Threats Feed</CardTitle>
            </div>
            <span className="text-[9px] bg-rose-500/10 text-rose-400 font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-500/20">
              Active Warning Indicators
            </span>
          </CardHeader>
          
          <CardContent className="p-4 flex flex-col gap-3">
            {criticalThreats.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="flex justify-between items-center bg-black/40 hover:bg-black/60 border border-rose-500/20 rounded-xl px-5 py-3.5 cursor-pointer hover:border-rose-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-xs font-semibold text-white/95 truncate max-w-[280px]">{item.label}</span>
                  <span className="text-[9px] text-white/40">{item.timestamp}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-extrabold">
                    {item.score}% Risk Alert
                  </span>
                  <ChevronRight size={14} className="text-white/30" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
