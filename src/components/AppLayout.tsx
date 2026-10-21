import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Building2,
  SunMedium,
  Bot,
  FileBarChart,
  Settings as SettingsIcon,
  Leaf,
  Menu,
  X,
  ChevronLeft,
  Search,
  Bell,
} from 'lucide-react';
import { NOTIFICATIONS, DEMO_USER } from '@/data/demoData';

export const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/map', label: 'Smart City Map', icon: Map },
  { to: '/buildings', label: 'Buildings', icon: Building2 },
  { to: '/solar-analysis', label: 'Solar Analysis', icon: SunMedium },
  { to: '/agent', label: 'AI Sustainability Agent', icon: Bot },
  { to: '/reports', label: 'Sustainability Reports', icon: FileBarChart },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/map': 'Smart City Map',
  '/buildings': 'Buildings Management',
  '/solar-analysis': 'Solar Analysis',
  '/agent': 'AI Sustainability Agent',
  '/reports': 'Sustainability Reports',
  '/settings': 'Settings',
};

function Breadcrumbs({ pathname }: { pathname: string }) {
  const title = PAGE_TITLES[pathname] ?? 'EcoGrid';
  return (
    <nav className="flex items-center gap-2 text-sm text-navy-500" aria-label="Breadcrumb">
      <span className="text-forest-600 font-semibold">EcoGrid</span>
      <ChevronLeft className="h-3.5 w-3.5 rotate-180 text-navy-300" />
      <span className="text-navy-800 font-medium">{title}</span>
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6f5]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'z-40 flex flex-col bg-navy-950 text-navy-100 transition-all duration-300 ease-in-out',
          'fixed lg:static inset-y-0 left-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center gap-2.5 px-4 border-b border-navy-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 text-white shadow-lg shadow-forest-900/30">
            <Leaf className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold tracking-tight leading-tight">EcoGrid</div>
              <div className="text-[11px] text-forest-300 font-medium">Egypt · Solar Intelligence</div>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-navy-300 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-forest-600 text-white shadow-md shadow-forest-900/30'
                      : 'text-navy-300 hover:bg-navy-900 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden lg:block border-t border-navy-900/60 p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-navy-400 hover:bg-navy-900 hover:text-white transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-navy-100 bg-white/90 backdrop-blur-md px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-navy-700 hover:text-forest-700"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-base font-bold text-navy-900 leading-tight">
              {PAGE_TITLES[location.pathname] ?? 'EcoGrid'}
            </h1>
            <Breadcrumbs pathname={location.pathname} />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
              <input
                type="search"
                placeholder="Search buildings, reports…"
                className="w-56 lg:w-72 rounded-xl border border-navy-200 bg-navy-50/60 pl-9 pr-3 py-2 text-sm text-navy-800 placeholder:text-navy-400 focus:bg-white focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/15 transition"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-navy-600 hover:bg-navy-50 hover:text-forest-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-accent ring-2 ring-white" />
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 z-40 rounded-2xl bg-white border border-navy-100 shadow-elevated p-2 animate-scale-in origin-top-right">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-navy-900">Notifications</span>
                      <span className="text-xs text-navy-400">{unreadCount} new</span>
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-navy-50 transition-colors"
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-emerald-accent' : 'bg-navy-200'}`} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-navy-900">{n.title}</div>
                            <div className="text-xs text-navy-500">{n.detail}</div>
                            <div className="text-[11px] text-navy-400 mt-0.5">{n.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="flex items-center gap-2.5 rounded-xl pl-1 pr-2.5 py-1 hover:bg-navy-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-forest-500 to-navy-700 text-white text-xs font-bold">
                {DEMO_USER.initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-navy-900 leading-tight">{DEMO_USER.name}</div>
                <div className="text-[11px] text-navy-500 leading-tight">Demo Profile</div>
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
