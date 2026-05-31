'use client';
import { useState, useMemo } from 'react';

interface Upgrade { id: string; name: string; cost: number; effect: string; category: string; }
interface Props { upgrades: Upgrade[] }

export default function UpgradeROICalculator({ upgrades }: Props) {
  const [cash, setCash] = useState(5000);
  const [numGrills, setNumGrills] = useState(3);
  const [tableTier, setTableTier] = useState(2);
  const [meatTier, setMeatTier] = useState('B');
  const [upgradeCost, setUpgradeCost] = useState(3000);
  const [incomeIncrease, setIncomeIncrease] = useState(20);
  const [playStyle, setPlayStyle] = useState<'active' | 'offline' | 'mixed'>('active');

  const results = useMemo(() => {
    const activeMultiplier = playStyle === 'active' ? 1.0 : playStyle === 'offline' ? 0.5 : 0.75;
    const baseIncomePerMin = numGrills * tableTier * 15 * activeMultiplier;
    const newIncomePerMin = baseIncomePerMin * (1 + incomeIncrease / 100);
    const incomeGain = newIncomePerMin - baseIncomePerMin;
    const paybackMin = incomeGain > 0 ? upgradeCost / incomeGain : Infinity;
    const paybackHours = paybackMin / 60;
    const canAfford = cash >= upgradeCost;
    const recommendation = !canAfford ? 'Wait — not enough cash' : paybackHours <= 2 ? 'Buy now — fast payback' : paybackHours <= 8 ? 'Good buy — solid ROI' : 'Consider alternatives — slow payback';

    const tierScores: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };
    const currentScore = numGrills * 2 + tableTier * 3 + (tierScores[meatTier] || 1);

    const roiRanking = upgrades
      .filter(u => u.cost <= cash)
      .map(u => ({ name: u.name, cost: u.cost, roi: (incomeGain > 0 ? u.cost / (baseIncomePerMin * 0.15) : Infinity) }))
      .sort((a, b) => a.roi - b.roi)
      .slice(0, 5);

    return { paybackHours, canAfford, recommendation, roiRanking, incomeGain };
  }, [cash, numGrills, tableTier, meatTier, upgradeCost, incomeIncrease, playStyle, upgrades]);

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 italic">⚠️ Calculator uses estimated values. All inputs are editable — adjust if in-game values differ.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Current Cash</label>
          <input type="number" min="0" value={cash} onChange={e => setCash(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Grills</label>
          <input type="number" min="1" max="20" value={numGrills} onChange={e => setNumGrills(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Table Tier (1-4)</label>
          <input type="number" min="1" max="4" value={tableTier} onChange={e => setTableTier(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Current Meat Tier</label>
          <select value={meatTier} onChange={e => setMeatTier(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {['S', 'A', 'B', 'C', 'D'].map(t => <option key={t} value={t}>{t} Tier</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Upgrade Cost</label>
          <input type="number" min="0" value={upgradeCost} onChange={e => setUpgradeCost(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Income Increase (%)</label>
          <input type="number" min="1" max="200" value={incomeIncrease} onChange={e => setIncomeIncrease(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Play Style</label>
          <select value={playStyle} onChange={e => setPlayStyle(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="active">Active</option>
            <option value="offline">Offline</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{results.paybackHours === Infinity ? '∞' : results.paybackHours.toFixed(1)}h</div>
          <div className="text-xs text-gray-500">Payback Time</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">+{results.incomeGain.toFixed(1)}/min</div>
          <div className="text-xs text-gray-500">Income Gain</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
          <div className="text-sm font-bold text-orange-500">{results.recommendation}</div>
          <div className="text-xs text-gray-500">Recommendation</div>
        </div>
      </div>

      {results.roiRanking.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Best Upgrades Within Budget</h3>
          <div className="space-y-2">
            {results.roiRanking.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-800 rounded">
                <span className="font-medium">{i + 1}. {item.name}</span>
                <span className="text-sm text-gray-500">{item.cost.toLocaleString()} cash</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
