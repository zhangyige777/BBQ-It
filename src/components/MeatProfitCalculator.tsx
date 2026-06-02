'use client';
import { useEffect, useState, useMemo } from 'react';

interface Meat {
  id: string; name: string; rawCost: number; cookValue: number;
  perfectValue: number; burnValue: number; cookTime: number;
}

interface Props { meats: Meat[] }

export default function MeatProfitCalculator({ meats }: Props) {
  const [meatId, setMeatId] = useState(meats[0]?.id || '');
  const [rawCost, setRawCost] = useState(meats[0]?.rawCost || 0);
  const [sellOffer, setSellOffer] = useState(meats[0]?.perfectValue || 0);
  const [cookQuality, setCookQuality] = useState<'raw' | 'normal' | 'perfect' | 'burnt'>('perfect');
  const [numGrills, setNumGrills] = useState(3);
  const [cookTime, setCookTime] = useState(meats[0]?.cookTime || 10);
  const [offlineTime, setOfflineTime] = useState(8);
  const [bonusMultiplier, setBonusMultiplier] = useState(1.0);

  const selectedMeat = meats.find(m => m.id === meatId);

  useEffect(() => {
    window.trackEvent?.('calculator_used', { name: 'meat_profit' });
  }, []);

  const handleMeatChange = (id: string) => {
    const meat = meats.find(m => m.id === id);
    if (meat) {
      setMeatId(id);
      setRawCost(meat.rawCost);
      setCookTime(meat.cookTime);
      setSellOffer(cookQuality === 'perfect' ? meat.perfectValue : cookQuality === 'normal' ? meat.cookValue : meat.burnValue);
    }
  };

  const handleQualityChange = (q: string) => {
    setCookQuality(q as any);
    const meat = meats.find(m => m.id === meatId);
    if (meat) {
      setSellOffer(q === 'perfect' ? meat.perfectValue : q === 'normal' ? meat.cookValue : q === 'burnt' ? meat.burnValue : meat.rawCost);
    }
  };

  const results = useMemo(() => {
    const adjustedSell = sellOffer * bonusMultiplier;
    const profitPerMeat = adjustedSell - rawCost;
    const cookTimeMin = cookTime / 60;
    const profitPerMinute = cookTimeMin > 0 ? profitPerMeat / cookTimeMin : 0;
    const grillsProfitPerMin = profitPerMinute * numGrills;
    const offlineMinutes = offlineTime * 60;
    const offlineCooks = cookTimeMin > 0 ? Math.floor(offlineMinutes / cookTimeMin) * numGrills : 0;
    const offlineProfit = offlineCooks * profitPerMeat;
    const breakEven = profitPerMeat <= 0;

    let bestMeat = selectedMeat?.name || '';
    let bestProfit = profitPerMinute;
    meats.forEach(m => {
      const p = (m.perfectValue - m.rawCost) / (m.cookTime / 60);
      if (p > bestProfit) { bestProfit = p; bestMeat = m.name; }
    });

    return { profitPerMeat, profitPerMinute, grillsProfitPerMin, offlineProfit, bestMeat, breakEven, offlineCooks };
  }, [rawCost, sellOffer, cookTime, numGrills, offlineTime, bonusMultiplier, meats, selectedMeat]);

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
          <label className="block text-sm font-medium mb-1">Cook Quality</label>
          <select value={cookQuality} onChange={e => handleQualityChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="raw">Raw</option>
            <option value="normal">Normal</option>
            <option value="perfect">Perfect</option>
            <option value="burnt">Burnt</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Raw Meat Cost</label>
          <input type="number" value={rawCost} onChange={e => setRawCost(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sell Offer</label>
          <input type="number" value={sellOffer} onChange={e => setSellOffer(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Grills</label>
          <input type="number" min="1" max="20" value={numGrills} onChange={e => setNumGrills(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cook Time (seconds)</label>
          <input type="number" min="1" value={cookTime} onChange={e => setCookTime(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Offline Duration (hours)</label>
          <input type="number" min="0" step="0.5" value={offlineTime} onChange={e => setOfflineTime(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bonus Multiplier</label>
          <input type="number" min="1" step="0.1" value={bonusMultiplier} onChange={e => setBonusMultiplier(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{results.profitPerMeat.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Profit / Meat</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{results.grillsProfitPerMin.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Profit / Min ({numGrills} grills)</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{results.offlineProfit.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Offline ({offlineTime}h)</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-500">{results.bestMeat || 'N/A'}</div>
          <div className="text-xs text-gray-500">Best Meat</div>
        </div>
      </div>

      {results.breakEven && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">⚠️ <strong>Break-even Warning:</strong> Your sell offer is at or below the raw cost. You are losing money on each cook.</p>
        </div>
      )}
    </div>
  );
}
