'use client';

import React, { useState } from 'react';
import {
  Truck,
  FileCheck,
  Download,
  CheckCircle2,
  Anchor,
  Globe,
  Plus
} from 'lucide-react';
import { MOCK_SHIPMENTS, ShipmentRecord } from '@/data/mockData';

export default function ShipmentModule() {
  const [selectedDocShipment, setSelectedDocShipment] = useState<ShipmentRecord | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 16: Shipment & Export Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Export Containers & Documentation Package</h2>
          <p className="text-xs text-slate-500">Track container bookings, vessel schedules, tracking IDs, Commercial Invoices, Packing Lists, and Certificates of Origin.</p>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SHIPMENTS.map((shp) => (
          <div key={shp.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-xs">{shp.shipmentCode}</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{shp.buyer}</h3>
                  <div className="text-xs text-slate-500 font-mono">Order {shp.orderNumber}</div>
                </div>
                <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  {shp.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Container Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{shp.containerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier / Shipping Line:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{shp.courier} ({shp.trackingNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Port Route:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{shp.portOfLoading} → {shp.destinationPort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Cartons & Weight:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{shp.totalCartons} Cartons ({shp.totalGrossWeightKg} kg)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">${shp.invoiceAmount.toLocaleString()}</div>
              <button
                onClick={() => setSelectedDocShipment(shp)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" /> Generate Export Docs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Documentation Package Preview Drawer / Modal */}
      {selectedDocShipment && (
        <div className="glass-panel rounded-2xl p-6 space-y-4 border-2 border-blue-500">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase font-mono">{selectedDocShipment.shipmentCode} Export Documentation Package</div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Ready for Customs Clearance & Bank Submission</h3>
            </div>
            <button onClick={() => setSelectedDocShipment(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">1. Commercial Invoice</div>
              <div className="text-[11px] text-slate-500">Invoice Amount: ${selectedDocShipment.invoiceAmount.toLocaleString()}</div>
              <button className="text-blue-600 font-bold hover:underline">Download Commercial Invoice (PDF) →</button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">2. Master Packing List</div>
              <div className="text-[11px] text-slate-500">{selectedDocShipment.totalCartons} Cartons detailed by size breakdown</div>
              <button className="text-blue-600 font-bold hover:underline">Download Packing List (PDF) →</button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">3. Certificate of Origin (GSP)</div>
              <div className="text-[11px] text-slate-500">Chamber of Commerce Verified</div>
              <button className="text-blue-600 font-bold hover:underline">Download Certificate (PDF) →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
