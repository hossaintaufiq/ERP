'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Calculator,
  CalendarDays,
  Receipt,
  LogOut,
  ChevronsUpDown,
  Menu,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ModuleId } from './Sidebar';
import { useAuth } from '@/lib/auth';
import { erpApi, resources } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeRole: string;
  setActiveRole: (roleId: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  unreadCount: number;
  onOpenNav?: () => void;
}

export default function Header({
  activeRole,
  setActiveRole,
  darkMode,
  setDarkMode,
  activeModule,
  setActiveModule,
  unreadCount,
  onOpenNav,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const rolesQ = useQuery({
    queryKey: ['roles-header'],
    queryFn: () => resources.list('roles', { limit: 50 }),
  });
  const roles = ((rolesQ.data as any)?.data || []) as { id: string; name: string; permissions?: string[] }[];
  const currentRoleObj = roles.find((r) => r.id === activeRole) || roles[0] || { id: activeRole, name: activeRole };

  const runSearch = async (q: string) => {
    setSearchQ(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res: any = await erpApi.search(q);
      setSearchResults(res.results || []);
    } catch {
      setSearchResults([]);
    }
  };

  const goResult = (r: any) => {
    setSearchResults([]);
    setSearchQ('');
    setMobileSearchOpen(false);
    if (r.type === 'orders') setActiveModule('sales');
    if (r.type === 'employees') setActiveModule('employee');
    if (r.type === 'inventory') setActiveModule('inventory');
    if (r.type === 'buyers') setActiveModule('customers');
    if (r.type === 'styles') setActiveModule('styles');
    if (r.type === 'shipments') setActiveModule('shipment');
  };

  const SearchField = ({ className }: { className?: string }) => (
    <div className={cn('relative w-full', className)}>
      <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <Input
        type="search"
        placeholder="Search orders, buyers, styles…"
        className="pl-9 h-9"
        value={searchQ}
        onChange={(e) => runSearch(e.target.value)}
        aria-label="Global search"
      />
      {!!searchResults.length && (
        <Card className="absolute top-11 left-0 right-0 z-50 max-h-64 overflow-y-auto py-1 shadow-lg">
          {searchResults.map((r, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2.5 text-xs hover:bg-accent transition-colors touch-manipulation"
              onClick={() => goResult(r)}
            >
              <span className="font-semibold">{r.label}</span>
              <span className="text-muted-foreground ml-2">{r.type}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="h-14 sm:h-16 px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onOpenNav}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:block flex-1 max-w-xl min-w-0">
          <SearchField />
        </div>

        <div className="flex-1 md:hidden min-w-0">
          <div className="text-xs font-semibold truncate capitalize text-foreground/90">
            {activeModule.replace(/_/g, ' ')}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">Garments ERP</div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          <div className="hidden xl:flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
            <Button
              size="sm"
              variant={activeModule === 'bom' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('bom')}
              className="h-7 text-[11px]"
            >
              <Calculator /> BOM
            </Button>
            <Button
              size="sm"
              variant={activeModule === 'production_planning' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('production_planning')}
              className="h-7 text-[11px]"
            >
              <CalendarDays /> Schedule
            </Button>
            <Button
              size="sm"
              variant={activeModule === 'payroll' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('payroll')}
              className="h-7 text-[11px]"
            >
              <Receipt /> Payroll
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 px-2 sm:px-3">
                <ShieldCheck className="text-primary h-4 w-4" />
                <div className="text-left hidden lg:block">
                  <div className="text-[10px] text-muted-foreground leading-none">Role</div>
                  <div className="text-xs font-semibold truncate max-w-[110px]">{currentRoleObj.name}</div>
                </div>
                <ChevronsUpDown className="size-3.5 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Select user role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={cn(activeRole === r.id && 'bg-accent')}
                >
                  <span className="flex-1">{r.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {(r.permissions || []).includes('*') ? 'Full' : `${(r.permissions || []).length}`}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setActiveModule('notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8 mx-0.5 hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-1.5 sm:px-2">
                <Avatar className="h-8 w-8 shadow-glow">
                  <AvatarFallback>{(user?.name || 'GE').slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold leading-tight">{user?.name || 'User'}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">{user?.role || 'role'}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveModule('settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-3 pb-3 border-t border-border/60 pt-2 animate-fade-up">
          <SearchField />
        </div>
      )}
    </header>
  );
}
