"use client";

import { useState, useEffect } from 'react';
import { AdminStats, EmployeePerformance, Alert, AuditLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, DollarSign, AlertTriangle, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [performance, setPerformance] = useState<EmployeePerformance[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, perfRes, alertsRes] = await Promise.all([
        fetch(`/api/admin/overview?period=${period}`),
        fetch('/api/admin/performance'),
        fetch('/api/admin/alerts'),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }
      if (perfRes.ok) {
        const data = await perfRes.json();
        setPerformance(data.data);
      }
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Tổng quan</h1>
          <p className="text-text-muted mt-1">Quản lý và giám sát hệ thống CRM</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            Tuần
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Tháng
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Nhân viên</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Tổng lead</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.totalLeads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Lead chưa gán</p>
                <p className="text-2xl font-bold text-text-dark">{stats?.unassignedLeads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Doanh thu</p>
                <p className="text-2xl font-bold text-text-dark">{formatCurrency(stats?.revenue || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hiệu suất theo nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance.map((emp, index) => (
                <div key={emp.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-text-dark">{emp.userName}</p>
                      <p className="text-xs text-text-muted">{emp.leadCount} lead • {emp.dealCount} deal</p>
                    </div>
                  </div>
                  <Badge variant={emp.winRate >= 20 ? 'success' : emp.winRate >= 10 ? 'warning' : 'error'}>
                    {emp.winRate}%
                  </Badge>
                </div>
              ))}
              {performance.length === 0 && (
                <p className="text-center text-text-muted py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.severity === 'error' ? 'bg-red-50' : 'bg-orange-50'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'error' ? 'text-red-500' : 'text-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-dark">{alert.message}</p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-center text-text-muted py-4">Không có cảnh báo</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          <Link href="/admin/audit">
            <Button variant="ghost" size="sm">Xem tất cả →</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentAudit?.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm">
                <Activity className="w-4 h-4 text-text-muted" />
                <span className="text-text-muted">{log.userName}</span>
                <span className="text-text-dark">{log.action}</span>
                <span className="text-text-muted ml-auto">
                  {new Date(log.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            ))}
            {(!stats?.recentAudit || stats.recentAudit.length === 0) && (
              <p className="text-center text-text-muted py-4">Chưa có hoạt động nào</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}