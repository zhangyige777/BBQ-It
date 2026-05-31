'use client';
import { useState } from 'react';

export default function GrillLayoutPlanner() {
  const [numGrills, setNumGrills] = useState(4);
  const [numTables, setNumTables] = useState(1);
  const [stage, setStage] = useState<'early' | 'mid' | 'late'>('mid');
  const [playStyle, setPlayStyle] = useState<'active' | 'offline' | 'mixed'>('active');

  const getLayout = () => {
    const activeGrills = playStyle === 'offline' ? Math.max(1, Math.floor(numGrills * 0.2)) : playStyle === 'mixed' ? Math.ceil(numGrills * 0.5) : numGrills;
    const offlineGrills = numGrills - activeGrills;

    if (stage === 'early') {
      return {
        title: 'Beginner Layout',
        layout: `[Table x${numTables}] → [${' Grill'.repeat(Math.min(activeGrills, 3))} ]`,
        tips: ['Focus on 2-3 active grills only', 'Keep everything close together', 'Use the same meat on all grills for easy timing'],
      };
    }
    if (stage === 'mid') {
      return {
        title: 'Mid-Game Layout',
        layout: `ACTIVE: [Table x${numTables}] → [${activeGrills} Active Grills]\nOFFLINE: [${offlineGrills} Offline Grills]`,
        tips: ['Separate active and offline zones', 'Stagger active grill start times by 3-5s', 'Use Auto Sell to manage offers while cooking'],
      };
    }
    return {
      title: 'Late-Game Layout',
      layout: `ACTIVE ZONE:  [Table x${numTables}] → [${activeGrills} Grills] [Smoker]\nOFFLINE ZONE: [${offlineGrills} Offline Grills] [Smoker]`,
      tips: ['Dedicate active zone to premium meats with perfect cooks', 'Fill offline grills with highest normal-profit meat', 'Use totems near active grills for quality/speed bonuses'],
    };
  };

  const layout = getLayout();

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 italic">⚠️ Layout suggestions are based on general strategies. Adjust for your specific setup.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Number of Grills</label>
          <input type="number" min="1" max="20" value={numGrills} onChange={e => setNumGrills(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Tables</label>
          <input type="number" min="1" max="5" value={numTables} onChange={e => setNumTables(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Progression Stage</label>
          <select value={stage} onChange={e => setStage(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="early">Early Game</option>
            <option value="mid">Mid Game</option>
            <option value="late">Late Game</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Play Style</label>
          <select value={playStyle} onChange={e => setPlayStyle(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="active">Active</option>
            <option value="offline">Offline Focus</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
        <h3 className="font-bold mb-2">{layout.title}</h3>
        <pre className="font-mono text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{layout.layout}</pre>
      </div>

      <div>
        <h3 className="font-bold mb-2">Tips</h3>
        <ul className="space-y-2">
          {layout.tips.map((tip, i) => (
            <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
