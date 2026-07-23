'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Calculator,
  CalendarDays,
  Receipt,
  ChevronDown,
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
  const roleDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roleDropdownOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setRoleDropdownOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRoleDropdownOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [roleDropdownOpen]);

  const shortcutClass = (active: boolean) =>
    `inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors ${
      active
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-stone-600 dark:text-stone-300 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-700 dark:hover:text-brand-300'
    }`;

  return (
    <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO #, buyer, style, material, employee..."
            className="input-field pl-9 py-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700 text-[11px] font-medium">
          <button onClick={() => setActiveModule('bom')} className={shortcutClass(activeModule === 'bom')}>
            <Calculator className="w-4 h-4" />
            <span>BOM</span>
          </button>
          <button
            onClick={() => setActiveModule('production_planning')}
            className={shortcutClass(activeModule === 'production_planning')}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedule</span>
          </button>
          <button onClick={() => setActiveModule('payroll')} className={shortcutClass(activeModule === 'payroll')}>
            <Receipt className="w-4 h-4" />
            <span>Payroll</span>
          </button>
        </div>

        <div ref={roleDropdownRef} className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-brand-600/40 transition-all text-xs font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-stone-400 leading-none">Active role</div>
              <div className="text-stone-800 dark:text-stone-100 font-semibold truncate max-w-[130px]">
                {currentRoleObj.name}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-lg shadow-panel-dark border border-stone-200 dark:border-stone-800 py-2 z-50 animate-fade-up duration-200">
              <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Select user role
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {MOCK_USER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                      activeRole === r.id
                        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 font-semibold'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.color}`}>{r.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveModule('notifications')}
          className="relative p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full ring-2 ring-white dark:ring-stone-900" />
          )}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          title="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-stone-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center text-xs shadow-glow">
            GE
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold leading-tight text-stone-900 dark:text-stone-100">Al-Mustafiz Rahman</div>
            <div className="text-[10px] text-stone-500 font-medium">Owner & CEO</div>
          </div>
        </div>
      </div>
    </header>
  );
}
