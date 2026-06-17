"use client";

import { useState } from 'react';
import { User, UserRole, UserStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, MoreHorizontal, Edit, Trash2, UserCog, Key, Lock, Mail, Users } from 'lucide-react';
import Link from 'next/link';

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onChangeRole?: (user: User, role: UserRole) => void;
  onToggleStatus?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onViewLeads?: (user: User) => void;
}

export function UserTable({ 
  users, 
  onEdit, 
  onDelete, 
  onChangeRole, 
  onToggleStatus,
  onResetPassword,
  onViewLeads,
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    return role === 'admin' ? (
      <Badge variant="default" className="bg-primary/10 text-primary">Admin</Badge>
    ) : (
      <Badge variant="default" className="bg-gray-100 text-gray-600">User</Badge>
    );
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<UserStatus, "success" | "warning" | "error" | "default"> = {
      active: 'success',
      invited: 'warning',
      inactive: 'error',
      deleted: 'default',
    };
    const labels: Record<UserStatus, string> = {
      active: 'Active',
      invited: 'Invited',
      inactive: 'Inactive',
      deleted: 'Deleted',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Tìm theo tên, email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">Người dùng</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">Vai trò</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">Trạng thái</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">Lead</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-text-dark">Đăng nhập</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-text-dark">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-text-dark">{user.name}</p>
                      <p className="text-sm text-text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewLeads?.(user)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    {user.leadCount || 0}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{formatDate(user.lastLoginAt || '')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangeRole?.(user, user.role === 'admin' ? 'user' : 'admin')}>
                          <UserCog className="w-4 h-4 mr-2" />
                          {user.role === 'admin' ? 'Hạ xuống User' : 'Nâng lên Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onResetPassword?.(user)}>
                          <Key className="w-4 h-4 mr-2" />
                          Reset mật khẩu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onToggleStatus?.(user)}
                          className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">Không tìm thấy người dùng nào</p>
        </div>
      )}
    </div>
  );
}