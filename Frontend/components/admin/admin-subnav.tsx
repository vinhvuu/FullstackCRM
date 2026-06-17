"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', exact: true },
  { href: '/admin/users', label: 'Người dùng' },
  { href: '/admin/leads', label: 'Chia lead' },
  { href: '/admin/audit', label: 'Nhật ký' },
  { href: '/admin/settings', label: 'Cấu hình' },
];

export function AdminSubnav() {
  const pathname = usePathname() || '';

  return (
    <div className="sticky top-16 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="flex gap-1 px-6 overflow-x-auto">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-dark hover:border-gray-300"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}