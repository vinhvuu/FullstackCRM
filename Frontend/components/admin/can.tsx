"use client";

import { useAuth } from './auth-provider';
import { UserRole } from '@/types';

interface CanProps {
  role?: UserRole;
  children: React.ReactNode;
}

export function Can({ role, children }: CanProps) {
  const { user } = useAuth();

  if (!user) return null;
  if (role && user.role !== role) return null;

  return <>{children}</>;
}