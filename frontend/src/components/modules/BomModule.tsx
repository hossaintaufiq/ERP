'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Shirt,
  Sparkles,
  ArrowDown,
  Boxes,
  DollarSign,
  Plus,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_STYLES, StyleProduct } from '@/data/mockData';

export default function BomModule() {
  const [selectedStyle, setSelectedStyle] = useState<StyleProduct>(MOCK_STYLES[0]);
  const [targetQuantity, setTargetQuantity] = useState<number>(5000);

  // Custom material addition
  const [customMaterials, setCustomMaterials] = useState<
    { name: string; category: 'Fabric' | 'Accessories' | 'Trims' | 'Packaging'; perPiece: number; unit: string; price: number }[]
  >([]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialQty, setNewMaterialQty] = useState(1);
  const [newMaterialUnit, setNewMaterialUnit] = useState('Pcs');

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialName) return;
    setCustomMaterials([
      ...customMaterials,
      { name: newMaterialName, category: 'Accessories', perPiece: newMaterialQty, unit: newMaterialUnit, price: 0.10 },
    ]);
    setNewMaterialName('');
  };

  // Combine style BOM with custom added items
  const activeBomItems = [
    ...selectedStyle.bomRatio,
    ...customMaterials.map((cm) => ({
      material: cm.name,
      category: cm.category,
      consumptionPerPiece: cm.perPiece,
      unit: cm.unit,
      unitPrice: cm.price,
    })),
  ];

  // Calculations
  const calculatedItems = activeBomItems.map((item) => {
    const totalNeeded = item.consumptionPerPiece * targetQuantity;
    const totalCost = totalNeeded * item.unitPrice;
    return {
      ...item,
      totalNeeded,
      totalCost,
    };
  });

  const totalCostBudget = calculatedItems.reduce((acc, curr) => acc + curr.totalCost, 0);
  const costPerGarment = totalCostBudget / (targetQuantity || 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 5: Bill of Materials (BOM)
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Automated ERP Requirement Calculator</h2>
          <p className="text-xs text-slate-500">
            One of the most critical core modules. Select a style and target quantity to instantly compute factory fabric & accessory procurement needs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Export BOM Sheet (XLSX)
          </button>
        </div>
      </div>

      {/* Style & Quantity Selector Control Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Target Order Configuration</span>
              <h3 className="text-lg font-black">{selectedStyle.name} ({selectedStyle.styleNumber})</h3>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Presets:</span>
            {[1000, 5000, 10000, 25000, 50000].map((qty) => (
              <button
                key={qty}
                onClick={() => setTargetQuantity(qty)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  targetQuantity === qty
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {qty.toLocaleString()} Pcs
              </button>
            ))}
          </div>
        </div>

        {/* Sliders and Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-2">1. Select Garment Style</label>
            <select
              value={selectedStyle.styleNumber}
              onChange={(e) => {
                const found = MOCK_STYLES.find((s) => s.styleNumber === e.target.value);
                if (found) setSelectedStyle(found);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MOCK_STYLES.map((s) => (
                <option key={s.styleNumber} value={s.styleNumber}>
                  {s.styleNumber} - {s.name} ({s.buyer})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between items-center font-bold">
              <label className="text-slate-400">2. Adjust Order Production Quantity</label>
              <span className="text-blue-400 text-base font-black font-mono">{targetQuantity.toLocaleString()} Shirts / Pieces</span>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={500}
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Example Calculation Box (Matching user requirement example!) */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <Sparkles className="w-4 h-4" /> Live ERP Automated Requirement Engine
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Requirements for {targetQuantity.toLocaleString()} Pcs of {selectedStyle.name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
            <div>
              <span className="text-slate-400">BOM Budget: </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">${totalCostBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-slate-400">Raw Material / Pcs: </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">${costPerGarment.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Material Requirements Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                <th className="py-3 px-3">Item / Material Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Unit Consumption (1 Piece)</th>
                <th className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 font-mono font-black">
                  ERP Total Needed ({targetQuantity.toLocaleString()} Pcs)
                </th>
                <th className="py-3 px-3 text-right">Est. Unit Price</th>
                <th className="py-3 px-3 text-right">Total Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {calculatedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {item.material}
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-300">
                    {item.consumptionPerPiece} {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                    {item.totalNeeded.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">${item.unitPrice.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${item.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Custom Material Form */}
        <form onSubmit={handleAddMaterial} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
          <div className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            + Add Custom Material / Accessory to Calculation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              type="text"
              placeholder="Material Name (e.g. Care Label, Drawstring)"
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Qty per Piece (e.g. 1)"
              value={newMaterialQty}
              onChange={(e) => setNewMaterialQty(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Unit (Meters, Pcs, Cones)"
              value={newMaterialUnit}
              onChange={(e) => setNewMaterialUnit(e.target.value)}
              className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition-colors">
              Add to BOM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
