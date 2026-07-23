'use client';

import React, { useState } from 'react';
import {
  Fingerprint,
  ScanFace,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play
} from 'lucide-react';

export default function AttendanceModule() {
  const [scanType, setScanType] = useState<'fingerprint' | 'rfid' | 'face'>('fingerprint');
  const [logs, setLogs] = useState([
    { id: '1', name: 'MD. Tariqul Islam', code: 'RG-EMP-101', time: '07:54 AM', mode: 'Fingerprint', status: 'On Time', hours: '8.5 hrs', ot: '1.5 hrs' },
    { id: '2', name: 'Nusrat Jahan', code: 'RG-EMP-102', time: '07:58 AM', mode: 'Face Recognition', status: 'On Time', hours: '8.0 hrs', ot: '0 hrs' },
    { id: '3', name: 'Shahadat Hossain', code: 'RG-EMP-103', time: '08:14 AM', mode: 'RFID Card', status: 'Late (14m)', hours: '7.7 hrs', ot: '0 hrs' },
  ]);

  const simulateScan = () => {
    const names = ['Farhana Parvin', 'Kabir Hossain', 'Salma Begum', 'Monir Khan'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newLog = {
      id: Date.now().toString(),
      name: randomName,
      code: `RG-EMP-${Math.floor(106 + Math.random() * 20)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: scanType === 'fingerprint' ? 'Fingerprint' : scanType === 'rfid' ? 'RFID Card' : 'Face Recognition',
      status: 'On Time',
      hours: '8.0 hrs',
      ot: '1.0 hrs',
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 12: Biometric Attendance
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-sans">Turnstile Biometric & RFID Telemetry</h2>
          <p className="text-xs text-slate-500">Auto-calculates working hours, late entry deductions, overtime hours, and shift logs.</p>
        </div>

        <button
          onClick={simulateScan}
          className="bg-status-success hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> Simulate Biometric Scan
        </button>
      </div>

      {/* Sensor Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setScanType('fingerprint')}
          className={`glass-panel p-4 rounded-xl cursor-pointer flex items-center gap-3 border-2 transition-all ${
            scanType === 'fingerprint' ? 'border-brand-700 bg-stone-100/50 dark:bg-stone-900/40' : 'border-transparent'
          }`}
        >
          <Fingerprint className="w-8 h-8 text-brand-600" />
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Fingerprint Scanner</div>
            <div className="text-[10px] text-slate-400">Optic Gate Scanner #01</div>
          </div>
        </div>

        <div
          onClick={() => setScanType('rfid')}
          className={`glass-panel p-4 rounded-xl cursor-pointer flex items-center gap-3 border-2 transition-all ${
            scanType === 'rfid' ? 'border-brand-700 bg-stone-100/50 dark:bg-stone-900/40' : 'border-transparent'
          }`}
        >
          <CreditCard className="w-8 h-8 text-brand-600" />
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">RFID Proximity Card</div>
            <div className="text-[10px] text-slate-400">Smart Card Reader #02</div>
          </div>
        </div>

        <div
          onClick={() => setScanType('face')}
          className={`glass-panel p-4 rounded-xl cursor-pointer flex items-center gap-3 border-2 transition-all ${
            scanType === 'face' ? 'border-brand-700 bg-stone-100/50 dark:bg-stone-900/40' : 'border-transparent'
          }`}
        >
          <ScanFace className="w-8 h-8 text-emerald-500" />
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Face Recognition Terminal</div>
            <div className="text-[10px] text-slate-400">AI Dual Camera #03</div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Today's Live Shift Punch Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                <th className="py-3 px-3">Employee Code</th>
                <th className="py-3 px-3">Worker Name</th>
                <th className="py-3 px-3">Punch Timestamp</th>
                <th className="py-3 px-3">Verification Terminal</th>
                <th className="py-3 px-3">Working Hours</th>
                <th className="py-3 px-3">Overtime (OT)</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-brand-700">{log.code}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{log.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{log.time}</td>
                  <td className="py-3 px-3 text-slate-500">{log.mode}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{log.hours}</td>
                  <td className="py-3 px-3 font-bold text-status-success">{log.ot}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`badge ${
                        log.status.includes('On Time')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-stone-900 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-stone-900 dark:text-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
