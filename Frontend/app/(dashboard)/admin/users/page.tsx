"use client";

import { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '@/types';
import { UserTable } from '@/components/admin/users/user-table';
import { UserFormDialog, UserFormData } from '@/components/admin/users/user-form-dialog';
import { UserLeadsDialog } from '@/components/admin/users/user-leads-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Download, Mail } from 'lucide-react';
import { getActiveUsers } from '@/lib/admin/admin-data';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'invite'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [leadsDialogOpen, setLeadsDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = getActiveUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    console.log('Submit:', formMode, data);
  };

  const handleChangeRole = async (user: User, newRole: UserRole) => {
    console.log('Change role:', user.name, newRole);
  };

  const handleToggleStatus = async (user: User) => {
    console.log('Toggle status:', user.name);
  };

  const handleResetPassword = async (user: User) => {
    console.log('Reset password:', user.name);
    alert('Password reset email sent');
  };

  const handleDeleteUser = async (user: User) => {
    console.log('Delete user:', user.name);
  };

  const openCreateDialog = () => {
    setFormMode('create');
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openInviteDialog = () => {
    setFormMode('invite');
    setSelectedUser(null);
    setFormOpen(true);
  };

  const openEditDialog = (user: User) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormOpen(true);
  };

  const openUserLeadsDialog = (user: User) => {
    setSelectedUser(user);
    setLeadsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Người dùng</h1>
          <p className="text-text-muted mt-1">Quản lý tài khoản, vai trò và trạng thái nhân viên</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={openInviteDialog}>
            <Mail className="w-4 h-4" />
            Mời
          </Button>
          <Button variant="cta" className="gap-2" onClick={openCreateDialog}>
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      <UserTable
        users={users}
        onEdit={openEditDialog}
        onDelete={handleDeleteUser}
        onChangeRole={handleChangeRole}
        onToggleStatus={handleToggleStatus}
        onResetPassword={handleResetPassword}
        onViewLeads={openUserLeadsDialog}
      />

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        user={selectedUser}
        mode={formMode}
      />

      <UserLeadsDialog
        user={selectedUser}
        open={leadsDialogOpen}
        onOpenChange={setLeadsDialogOpen}
      />
    </div>
  );
}