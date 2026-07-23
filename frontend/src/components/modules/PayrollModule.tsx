'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Printer,
  DollarSign,
  CheckCircle2,
  FileText,
  X,
  Sparkles,
  Download
} from 'lucide-react';
import { MOCK_EMPLOYEES, Employee } from '@/data/mockData';

export default function PayrollModule() {
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">
            Module 13: Payroll & Compensation
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Automated Monthly Salary Disburser</h2>
          <p className="text-xs text-slate-500">Computes basic wage, housing allowance, overtime hours pay, attendance bonus, tax withholdings, and payslip generation.</p>
        </div>
        <button className="bg-status-success hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Run Automated Payroll for July 2026
        </button>
      </div>

      {/* Payroll Summary Table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Factory Payroll Register (July 2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-right">Basic Wage</th>
                <th className="py-3 px-3 text-right">HRA / Allowances</th>
                <th className="py-3 px-3 text-right">Overtime Pay (OT)</th>
                <th className="py-3 px-3 text-right">Attendance Bonus</th>
                <th className="py-3 px-3 text-right">Tax / PF Deductions</th>
                <th className="py-3 px-3 text-right font-black text-brand-700">Net Payable Salary</th>
                <th className="py-3 px-3 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {MOCK_EMPLOYEES.map((emp) => {
                const basic = emp.salary * 0.6;
                const hra = emp.salary * 0.25;
                const ot = emp.department === 'Sewing' ? 4500 : 2000;
                const bonus = emp.attendanceRate > 98 ? 1500 : 0;
                const deductions = emp.salary * 0.05;
                const netSalary = basic + hra + ot + bonus - deductions;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                      <div>{emp.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{emp.department}</td>
                    <td className="py-3 px-3 text-right font-mono">BDT {basic.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">BDT {hra.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-status-success font-bold">+BDT {ot.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-brand-700">+BDT {bonus.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-status-danger">-BDT {deductions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-brand-700 dark:text-brand-400 text-sm">
                      BDT {netSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedPayslipEmp(emp)}
                        className="bg-brand-800 hover:bg-brand-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg shadow"
                      >
                        Generate Payslip 📄
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Payslip Modal Generator */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">GARMENTS ERP APPAREL LTD.</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Official Monthly Payslip</h3>
                <div className="text-xs text-slate-400">Pay Period: July 2026</div>
              </div>
              <button
                onClick={() => setSelectedPayslipEmp(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
              <div>
                <div className="text-slate-400 text-[10px]">Employee Name</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedPayslipEmp.name}</div>
                <div className="text-slate-500 font-mono">{selectedPayslipEmp.employeeCode}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Department & Designation</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{selectedPayslipEmp.department}</div>
                <div className="text-slate-500">{selectedPayslipEmp.designation}</div>
              </div>
            </div>

            {/* Earnings vs Deductions Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="font-extrabold uppercase tracking-wider text-status-success text-[10px]">Earnings</div>
                <div className="flex justify-between"><span>Basic Salary:</span><span className="font-mono">BDT {(selectedPayslipEmp.salary * 0.6).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>HRA & Allowance:</span><span className="font-mono">BDT {(selectedPayslipEmp.salary * 0.25).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Overtime Pay:</span><span className="font-mono text-status-success font-bold">+BDT 4,500</span></div>
                <div className="flex justify-between"><span>Attendance Bonus:</span><span className="font-mono text-brand-700">+BDT 1,500</span></div>
              </div>

              <div className="space-y-2">
                <div className="font-extrabold uppercase tracking-wider text-status-danger text-[10px]">Deductions & Tax</div>
                <div className="flex justify-between"><span>Provident Fund (PF):</span><span className="font-mono text-status-danger">-BDT {(selectedPayslipEmp.salary * 0.03).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Income Tax Withholding:</span><span className="font-mono text-status-danger">-BDT {(selectedPayslipEmp.salary * 0.02).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 dark:bg-stone-900/40 rounded-xl flex justify-between items-center text-xs">
              <span className="font-extrabold text-brand-900 dark:text-brand-100 uppercase">Net Disbursed Amount:</span>
              <span className="font-black text-brand-700 dark:text-brand-400 text-lg font-mono">
                BDT {(selectedPayslipEmp.salary + 4500 + 1500 - selectedPayslipEmp.salary * 0.05).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => alert('Printing Payslip PDF...')}
                className="bg-brand-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Payslip PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
