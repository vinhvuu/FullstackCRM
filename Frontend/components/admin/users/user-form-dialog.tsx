"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
  mode: 'create' | 'edit' | 'invite';
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  mustChangePassword: boolean;
  inviteEmails?: string[];
  ttlHours?: number;
}

export function UserFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  user, 
  mode 
}: UserFormDialogProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'user');
  const [password, setPassword] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [inviteEmails, setInviteEmails] = useState('');
  const [ttlHours, setTtlHours] = useState(72);
  const [loading, setLoading] = useState(false);

  const isEdit = mode === 'edit';
  const isInvite = mode === 'invite';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: UserFormData = isInvite 
      ? { 
          name: '', 
          email: '', 
          role, 
          mustChangePassword: false,
          inviteEmails: inviteEmails.split(',').map(e => e.trim()).filter(Boolean),
          ttlHours 
        }
      : {
          name,
          email,
          role,
          password: isEdit ? undefined : password,
          mustChangePassword: isEdit ? false : mustChangePassword,
        };

    try {
      await onSubmit(data);
      onOpenChange(false);
      setName('');
      setEmail('');
      setPassword('');
      setInviteEmails('');
    } finally {
      setLoading(false);
    }
  };

  const getRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isInvite ? 'Mời người dùng' : isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isInvite ? (
            <div className="space-y-4">
              <div>
                <Label>Email (nhập nhiều email cách nhau bằng dấu phẩy)</Label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Vai trò</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(v: string) => setRole(v as UserRole)}
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="admin" id="role-admin" />
                    <Label htmlFor="role-admin">Admin</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="user" id="role-user" />
                    <Label htmlFor="role-user">User</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Thời hạn lời mời (giờ)</Label>
                <select
                  value={ttlHours}
                  onChange={(e) => setTtlHours(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 mt-1"
                >
                  <option value={24}>24 giờ</option>
                  <option value={48}>48 giờ</option>
                  <option value={72}>72 giờ</option>
                  <option value={168}>7 ngày</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label>Họ và tên *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required={!isEdit}
                  disabled={isEdit}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required={!isEdit}
                  disabled={isEdit}
                />
              </div>
              {!isEdit && (
                <>
                  <div>
                    <Label>Mật khẩu {!isEdit && '*'}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isEdit ? '••••••••' : 'Nhập mật khẩu'}
                        required={!isEdit}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={getRandomPassword}
                      >
                        Tạo ngẫu
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted mt-1">Tối thiểu 8 ký tự</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mustChange"
                      checked={mustChangePassword}
                      onChange={(e) => setMustChangePassword(e.target.checked)}
                    />
                    <Label htmlFor="mustChange" className="text-sm font-normal">
                      Bắt buộc đổi mật khẩu lần đầu đăng nhập
                    </Label>
                  </div>
                </>
              )}
              <div>
                <Label>Vai trò *</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(v: string) => setRole(v as UserRole)}
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="admin" id="role-admin-edit" />
                    <Label htmlFor="role-admin-edit">Admin</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="user" id="role-user-edit" />
                    <Label htmlFor="role-user-edit">User</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : isInvite ? 'Gửi mời' : isEdit ? 'Lưu' : 'Tạo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}