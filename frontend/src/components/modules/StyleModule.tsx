'use client';

import React, { useState } from 'react';
import {
  Shirt,
  FileText,
  Layers,
  Palette,
  Ruler,
  Calculator,
  Plus,
  ExternalLink,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { MOCK_STYLES, StyleProduct } from '@/data/mockData';
import { ModuleId } from '../layout/Sidebar';

interface StyleModuleProps {
  setActiveModule: (id: ModuleId) => void;
}

export default function StyleModule({ setActiveModule }: StyleModuleProps) {
  const [selectedStyle, setSelectedStyle] = useState<StyleProduct>(MOCK_STYLES[0]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 4: Product & Style Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Style Catalog & Tech Pack Repository</h2>
          <p className="text-xs text-slate-500">Each garment style contains detailed tech pack specs, fabric compositions, accessories, size ratios, and BOM breakdowns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('bom')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Open BOM Calculator
          </button>
        </div>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_STYLES.map((style) => {
          const isSelected = selectedStyle.styleNumber === style.styleNumber;
          return (
            <div
              key={style.styleNumber}
              onClick={() => setSelectedStyle(style)}
              className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-xl'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex gap-4">
                <img src={style.image} alt={style.name} className="w-24 h-32 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-xs">{style.styleNumber}</span>
                    <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px]">
                      {style.buyer}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate">{style.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{style.season}</div>

                  <div className="p-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> {style.fabricSpec}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-slate-500">{style.colors.length} Colors</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModule('bom');
                  }}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View BOM ratio →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Style Detailed Spec Inspector */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase font-mono">{selectedStyle.styleNumber} Specification Sheet</div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{selectedStyle.name}</h3>
          </div>
          <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-2 border border-slate-200 dark:border-slate-700">
            <Download className="w-4 h-4" /> Download Tech Pack ({selectedStyle.techPackUrl})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" /> Fabric Specifications
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">{selectedStyle.fabricSpec}</div>
              <p className="text-slate-500 text-[11px]">Knit/Woven composition verified by Textile Testing Lab (Color Fastness Grade 4-5).</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" /> Accessories & Trims List
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5">
              {selectedStyle.accessories.map((acc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {acc}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-emerald-500" /> Size Range & Swatches
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedStyle.sizes.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-bold">
                    {s}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500">
                Colors: {selectedStyle.colors.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
