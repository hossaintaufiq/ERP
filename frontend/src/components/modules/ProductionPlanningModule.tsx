'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Scissors,
  Printer,
  Sparkles,
  Shirt,
  Waves,
  Flame,
  Package,
  Truck,
  ArrowRight,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { MOCK_PIPELINE_STAGES, MOCK_ORDERS, SalesOrder } from '@/data/mockData';

export default function ProductionPlanningModule() {
  const [orders, setOrders] = useState<SalesOrder[]>(MOCK_ORDERS);

  // Map order status to stage index
  const stageMap: Record<string, string> = {
    'Cutting': 'cutting',
    'In Production': 'sewing',
    'Sewing': 'sewing',
    'QC Inspection': 'ironing',
    'Delayed': 'sewing',
    'Packing': 'packing',
    'Shipped': 'shipment',
  };

  const advanceOrderStage = (orderNumber: string) => {
    const stageFlow: SalesOrder['status'][] = ['Cutting', 'Sewing', 'QC Inspection', 'Packing', 'Shipped'];
    setOrders(
      orders.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const currentIdx = stageFlow.indexOf(ord.status);
          const nextStatus = stageFlow[Math.min(currentIdx + 1, stageFlow.length - 1)];
          return { ...ord, status: nextStatus, progress: Math.min(ord.progress + 20, 100) };
        }
        return ord;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 9: Production Planning & Schedule
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">8-Stage Garment Production Pipeline</h2>
          <p className="text-xs text-slate-500">Floor managers track exactly which department and stage every buyer order is currently located in.</p>
        </div>
      </div>

      {/* 8-Stage Visual Schedule Pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-stretch gap-3 min-w-[1200px]">
          {MOCK_PIPELINE_STAGES.map((stage, idx) => {
            const activeStageOrders = orders.filter((o) => stageMap[o.status] === stage.id);
            return (
              <div
                key={stage.id}
                className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm"
              >
                {/* Stage Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400">STAGE {idx + 1}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{stage.name}</h3>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <span>Target: {stage.dailyTargetPcs.toLocaleString()}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{stage.efficiencyPercent}% Eff</span>
                  </div>
                </div>

                {/* Orders Stacked in this Stage */}
                <div className="space-y-2 flex-1 my-2">
                  {activeStageOrders.length === 0 ? (
                    <div className="p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-[11px] text-slate-400">
                      No active orders
                    </div>
                  ) : (
                    activeStageOrders.map((ord) => (
                      <div
                        key={ord.orderNumber}
                        className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex justify-between items-center font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                          <span>{ord.orderNumber}</span>
                          <span className="text-slate-500 font-sans">{ord.buyer}</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">{ord.productName}</div>
                        <div className="text-[10px] text-slate-400 flex justify-between">
                          <span>{ord.totalQuantity.toLocaleString()} Pcs</span>
                          <span>Due: {ord.deliveryDate}</span>
                        </div>

                        <button
                          onClick={() => advanceOrderStage(ord.orderNumber)}
                          className="w-full text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white py-1 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          Advance to Next Stage →
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Stage Total Count */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center font-bold text-[11px] text-slate-500">
                  {activeStageOrders.length} Order(s) in {stage.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
