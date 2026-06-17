"use client";

import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-2">403</h1>
          <p className="text-text-muted">Bạn không có quyền truy cập trang này</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Về Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}