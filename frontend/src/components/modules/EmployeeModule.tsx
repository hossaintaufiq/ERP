'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  Award,
  Search
} from 'lucide-react';
import { MOCK_EMPLOYEES, Employee } from '@/data/mockData';

export default function EmployeeModule() {
  const [department, setDepartment] = useState<string>('ALL');

  const filteredEmployees = department === 'ALL' ? MOCK_EMPLOYEES : MOCK_EMPLOYEES.filter((e) => e.department === department);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Module 11: Employee Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Factory Staff & Worker Directory</h2>
          <p className="text-xs text-slate-500">Manage 450 factory operators, line masters, QC technicians, HR officers, and maintenance engineers.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Employee
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {['ALL', 'Sewing', 'Cutting', 'Quality', 'Maintenance', 'HR & Admin'].map((dep) => (
          <button
            key={dep}
            onClick={() => setDepartment(dep)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              department === dep
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {dep}
          </button>
        ))}
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/40" />
              <div>
                <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">{emp.employeeCode}</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{emp.name}</h3>
                <div className="text-xs text-slate-500 font-semibold">{emp.designation}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{emp.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Salary:</span>
                <span className="font-bold text-emerald-600">BDT {emp.salary.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shift Schedule:</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{emp.shift}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <Award className="w-4 h-4 text-emerald-500" /> {emp.performanceScore}% Rating
              </div>
              <div className="text-slate-400">Attendance: <strong className="text-slate-900 dark:text-slate-100">{emp.attendanceRate}%</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
