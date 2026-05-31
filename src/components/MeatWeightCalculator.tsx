'use client';
import { useState, useMemo } from 'react';

interface Meat { id: string; name: string; rawCost: number; cookValue: number; perfectValue: number; cookTime: number; weight: number; }
interface Props { meats: Meat[] }

export default function MeatWeightCalculator({ meats }: Props) {
  const [meatId, setMeatId] = useState(meats[0]?.id || '');
  const [weight, setWeight] = useState(meats[0]?.weight || 1);
  const [multiplier, setMultiplier] = useState(1.0);
  const [cookQuality, setCookQuality] = useState<'normal' | 'perfect'>('perfect');

  const selectedMeat = meats.find(m => m.id === meatId);

  const handleMeatChange = (id: string) => {
    const m = meats.find(x => x.id === id);
    if (m) { setMeatId(id); setWeight(m.weight); }
  };

  const results = useMemo(() => {
    const meat = meats.find(m => m.id === meatId);
    if (!meat) return { sellValue: 0, efficiency: 0, recommendation: '' };

    const adjustedWeight = weight * multiplier;
    const baseValue = cookQuality === 'perfect' ? meat.perfectValue : meat.cookValue;
    const weightRatio = adjustedWeight / meat.weight;
    const sellValue = baseValue * weightRatio;
    const efficiency = meat.rawCost > 0 ? ((sellValue - meat.rawCost) / meat.rawCost * 100) : 0;

    const recommendation = efficiency > 200 ? 'Excellent — cook and sell immediately' :
      efficiency > 100 ? 'Good — profitable cook' :
      efficiency > 0 ? 'Marginal — consider better meat' : 'Loss — do not cook at this weight';

    return { sellValue, efficiency, recommendation, adjustedWeight };
  }, [meatId, weight, multiplier, cookQuality, meats]);

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 italic">⚠️ Calculator uses estimated values. All inputs are editable — adjust if in-game values differ.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Meat Type</label>
          <select value={meatId} onChange={e => handleMeatChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {meats.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight Multiplier</label>
          <input type="number" min="1" step="0.1" value={multiplier} onChange={e => setMultiplier(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cook Quality</label>
          <select value={cookQuality} onChange={e => setCookQuality(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="normal">Normal</option>
            <option value="perfect">Perfect</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{results.sellValue.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Est. Sell Value</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{results.efficiency.toFixed(0)}%</div>
          <div className="text-xs text-gray-500">Profit Margin</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
          <div className="text-sm font-bold text-orange-500">{results.recommendation}</div>
          <div className="text-xs text-gray-500">Recommendation</div>
        </div>
      </div>
    </div>
  );
}
