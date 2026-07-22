'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  User,
  Sparkles,
  Factory,
  Globe,
  Sliders
} from 'lucide-react';
import { MOCK_USER_ROLES } from '@/data/mockData';
import { ModuleId } from './Sidebar';

interface HeaderProps {
  activeRole: string;
  setActiveRole: (roleId: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  unreadCount: number;
}

export default function Header({
  activeRole,
  setActiveRole,
  darkMode,
  setDarkMode,
  activeModule,
  setActiveModule,
  unreadCount,
}: HeaderProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const currentRoleObj = MOCK_USER_ROLES.find((r) => r.id === activeRole) || MOCK_USER_ROLES[0];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-200">
      {/* Search & Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO #, Buyer (Zara, H&M), Style #, Material, Employee..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Module Shortcut Badges */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60 text-[11px] font-semibold">
          <button
            onClick={() => setActiveModule('bom')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeModule === 'bom' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            ⚡ BOM Calc
          </button>
          <button
            onClick={() => setActiveModule('production_planning')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeModule === 'production_planning' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🏭 Line Schedule
          </button>
          <button
            onClick={() => setActiveModule('payroll')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeModule === 'payroll' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            💳 Payroll
          </button>
        </div>

        {/* Role Switcher Selector (Module 19) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-slate-400 leading-none">Simulating Role</div>
              <div className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[130px]">
                {currentRoleObj.name}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Module 19: Select Active User Role
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {MOCK_USER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      activeRole === r.id ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${r.color}`}>
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell (Module 20 Trigger) */}
        <button
          onClick={() => setActiveModule('notifications')}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Module 20: Notifications Hub"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow">
            RG
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold leading-tight">Al-Mustafiz Rahman</div>
            <div className="text-[10px] text-slate-400 font-medium">Owner & CEO</div>
          </div>
        </div>
      </div>
    </header>
  );
}
