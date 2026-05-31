'use client';
import { useState, useMemo } from 'react';

interface Meat { id: string; name: string; rawCost: number; cookValue: number; perfectValue: number; cookTime: number; }
interface Props { meats: Meat[] }

export default function OfflineProfitCalculator({ meats }: Props) {
  const [numGrills, setNumGrills] = useState(3);
  const [meatId, setMeatId] = useState(meats[0]?.id || '');
  const [avgCookValue, setAvgCookValue] = useState(meats[0]?.cookValue || 0);
  const [duration, setDuration] = useState(8);
  const [bonus, setBonus] = useState(1.0);

  const handleMeatChange = (id: string) => {
    const m = meats.find(x => x.id === id);
    if (m) { setMeatId(id); setAvgCookValue(m.cookValue); }
  };

  const results = useMemo(() => {
    const meat = meats.find(m => m.id === meatId);
    const cookTimeMin = meat ? meat.cookTime / 60 : 1;
    const durationMin = duration * 60;
    const cooksPerGrill = cookTimeMin > 0 ? Math.floor(durationMin / cookTimeMin) : 0;
    const totalCooks = cooksPerGrill * numGrills;
    const earnings = totalCooks * avgCookValue * bonus;
    const cost = totalCooks * (meat?.rawCost || 0);
    const profit = earnings - cost;

    let bestMeat = meat?.name || '';
    let bestProfit = profit;
    meats.forEach(m => {
      const cpm = m.cookTime / 60;
      const cooks = cpm > 0 ? Math.floor(durationMin / cpm) * numGrills : 0;
      const p = cooks * (m.cookValue - m.rawCost) * bonus;
      if (p > bestProfit) { bestProfit = p; bestMeat = m.name; }
    });

    return { totalCooks, earnings, profit, bestMeat };
  }, [numGrills, meatId, avgCookValue, duration, bonus, meats]);

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 italic">⚠️ Calculator uses estimated values. All inputs are editable — adjust if in-game values differ.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Number of Offline Grills</label>
          <input type="number" min="1" max="20" value={numGrills} onChange={e => setNumGrills(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meat Type</label>
          <select value={meatId} onChange={e => handleMeatChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {meats.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Avg Cook Value (normal)</label>
          <input type="number" value={avgCookValue} onChange={e => setAvgCookValue(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Offline Duration (hours)</label>
          <input type="number" min="0.5" step="0.5" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bonus Multiplier</label>
          <input type="number" min="1" step="0.1" value={bonus} onChange={e => setBonus(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{results.earnings.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Gross Earnings</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{results.profit.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Net Profit</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{results.totalCooks}</div>
          <div className="text-xs text-gray-500">Total Cooks</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-500">{results.bestMeat || 'N/A'}</div>
          <div className="text-xs text-gray-500">Best Offline Meat</div>
        </div>
      </div>
    </div>
  );
}
