'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '../login/actions';
import { decodeJWT } from '../../lib/jwt';
import {
  LayoutDashboard,
  ShieldCheck,
  Navigation,
  IndianRupee,
  BadgePercent,
  Wallet,
  LogOut,
} from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'ops', 'finance', 'support'] },
  { name: 'Captains (KYC)', href: '/captains', icon: ShieldCheck, roles: ['super_admin', 'ops'] },
  { name: 'Rides (Live)', href: '/rides', icon: Navigation, roles: ['super_admin', 'ops', 'support'] },
  { name: 'Pricing Rules', href: '/pricing', icon: IndianRupee, roles: ['super_admin', 'finance'] },
  { name: 'Promo Codes', href: '/promos', icon: BadgePercent, roles: ['super_admin', 'ops'] },
  { name: 'Payouts', href: '/payouts', icon: Wallet, roles: ['super_admin', 'finance'] },
];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<'super_admin' | 'ops' | 'finance' | 'support'>('super_admin');
  const [username, setUsername] = useState('Super Admin');

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setRole(decoded.role);
        const roleNames = {
          super_admin: 'Super Admin',
          ops: 'Operations',
          finance: 'Finance Admin',
          support: 'Support Exec',
        };
        setUsername(roleNames[decoded.role] || 'Admin');
      }
    }
  }, []);

  async function handleLogout() {
    await logoutAction();
    router.push('/login');
    router.refresh();
  }

  const visibleItems = sidebarItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-chalk flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r-1 border-b-1 md:border-b-0 border-asphalt flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b-1 border-asphalt">
          <Link href="/dashboard" className="font-display text-2xl font-extrabold uppercase tracking-tight text-asphalt block">
            naaride CONTROLS
          </Link>
          <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">Ops Dashboard</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wide transition-all border-1 ${
                  isActive
                    ? 'bg-signal text-asphalt border-asphalt font-bold'
                    : 'text-gray-600 border-transparent hover:bg-chalk hover:text-asphalt'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t-1 border-asphalt bg-chalk/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-1 border-asphalt bg-signal flex items-center justify-center font-display font-extrabold text-asphalt">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-mono font-bold text-asphalt">{username}</p>
              <p className="text-[10px] font-mono text-gray-500 uppercase">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 border-1 border-asphalt bg-surface hover:bg-roadCoral hover:text-white transition-all text-asphalt"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-surface border-b-1 border-asphalt px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-meterGreen animate-pulse"></span>
            <span className="text-xs font-mono uppercase font-bold text-gray-600">Core Engine Online</span>
          </div>
          <div className="text-xs font-mono text-gray-500">
            System time: {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 bg-chalk overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
