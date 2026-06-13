import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/dashboard/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, Calendar,
  Shield, Settings, Activity, TrendingUp, Eye, Trash2,
  UserCheck, BarChart3, Clock, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'jobs', label: 'Job Moderation', icon: Briefcase },
  { id: 'mentorships', label: 'Mentorship Monitor', icon: GraduationCap },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [analyticsData, usersRes, eventsRes, jobsRes, mentorshipsRes] = await Promise.all([
        authService.fetchAdminAnalytics(),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/events`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/jobs`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/mentorships`, { headers }),
      ]);

      setAnalytics(analyticsData);
      
      const [ud, ed, jd, md] = await Promise.all([
        usersRes.json(), eventsRes.json(), jobsRes.json(), mentorshipsRes.json()
      ]);
      if (ud.success) setUsers(ud.data);
      if (ed.success) setEvents(ed.data);
      if (jd.success) setJobs(jd.data);
      if (md.success) setMentorships(md.data);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted');
        loadData();
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        loadData();
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleApproveJob = async (jobId: number, approved: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jobs/${jobId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(approved ? 'Job approved' : 'Job rejected');
        loadData();
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Job deleted');
        loadData();
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Event deleted');
        loadData();
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  if (!user) return null;

  // Chart data
  const roleDistribution = analytics ? [
    { name: 'Students', value: Number(analytics.totalStudents) || 0 },
    { name: 'Alumni', value: Number(analytics.totalAlumni) || 0 },
    { name: 'Admins', value: Number(analytics.totalAdmins) || 0 },
  ] : [];

  const activityData = [
    { name: 'Posts', value: Number(analytics?.totalPosts) || 0 },
    { name: 'Jobs', value: Number(analytics?.totalJobs) || 0 },
    { name: 'Events', value: Number(analytics?.totalEvents) || 0 },
    { name: 'Connections', value: Number(analytics?.totalConnections) || 0 },
    { name: 'Mentorships', value: Number(analytics?.activeMentorships) || 0 },
  ];

  return (
    <DashboardLayout
      navItems={navItems.map(n => ({
        ...n,
        badge: n.id === 'jobs' ? Number(analytics?.pendingJobs) || undefined : undefined
      }))}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleColor="border-l-2 border-l-red-500"
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent p-6 lg:p-8">
            <div className="relative z-10">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Admin Control Panel 🛡️
              </h1>
              <p className="text-muted-foreground">
                Monitor platform health, manage users, and moderate content.
              </p>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Users" value={analytics?.totalUsers || 0} icon={Users} color="from-blue-500 to-blue-600" />
            <StatsCard label="Students" value={analytics?.totalStudents || 0} icon={GraduationCap} color="from-green-500 to-green-600" />
            <StatsCard label="Alumni" value={analytics?.totalAlumni || 0} icon={UserCheck} color="from-purple-500 to-purple-600" />
            <StatsCard label="Recent Signups" value={analytics?.recentSignups || 0} icon={TrendingUp} color="from-orange-500 to-orange-600" subtitle="Last 30 days" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Distribution */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  User Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roleDistribution.some(r => r.value > 0) ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {roleDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <p className="text-muted-foreground">No user data to display</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Activity */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activityData.some(a => a.value > 0) ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <p className="text-muted-foreground">No activity data to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Posts" value={analytics?.totalPosts || 0} icon={Activity} color="from-indigo-500 to-indigo-600" />
            <StatsCard label="Total Jobs" value={analytics?.totalJobs || 0} icon={Briefcase} color="from-teal-500 to-teal-600" />
            <StatsCard label="Active Mentorships" value={analytics?.activeMentorships || 0} icon={GraduationCap} color="from-pink-500 to-pink-600" />
            <StatsCard label="Pending Jobs" value={analytics?.pendingJobs || 0} icon={AlertCircle} color="from-amber-500 to-amber-600" />
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">User Management</h2>
            <p className="text-muted-foreground text-sm">Manage all platform users, roles, and access</p>
          </div>

          <DataTable
            title="All Users"
            icon={Users}
            data={users}
            searchPlaceholder="Search users..."
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              {
                key: 'role',
                label: 'Role',
                render: (item: any) => (
                  <Badge className={`capitalize ${
                    item.role === 'admin' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                    item.role === 'alumni' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400' :
                    'bg-green-500/10 text-green-700 dark:text-green-400'
                  } border-0`}>{item.role}</Badge>
                )
              },
              {
                key: 'createdAt',
                label: 'Joined',
                render: (item: any) => new Date(item.createdAt).toLocaleDateString()
              },
            ]}
            actions={(item: any) => (
              <div className="flex items-center gap-1">
                {item.role !== 'admin' && (
                  <select
                    className="text-xs border border-border rounded px-2 py-1 bg-background"
                    value={item.role}
                    onChange={e => handleUpdateRole(item.id, e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteUser(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
            emptyMessage="No users found."
          />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Event Management</h2>
            <p className="text-muted-foreground text-sm">View and moderate all platform events</p>
          </div>

          <DataTable
            title="All Events"
            icon={Calendar}
            data={events}
            searchPlaceholder="Search events..."
            columns={[
              { key: 'title', label: 'Title' },
              {
                key: 'date',
                label: 'Date',
                render: (item: any) => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              },
              { key: 'location', label: 'Location', render: (item: any) => item.location || '—' },
              {
                key: 'createdBy',
                label: 'Created By',
                render: (item: any) => item.createdBy?.name || '—'
              },
            ]}
            actions={(item: any) => (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => handleDeleteEvent(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            emptyMessage="No events found."
          />
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Job Moderation</h2>
            <p className="text-muted-foreground text-sm">Review, approve, and moderate job postings</p>
          </div>

          <DataTable
            title="All Job Postings"
            icon={Briefcase}
            data={jobs}
            searchPlaceholder="Search jobs..."
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'company', label: 'Company' },
              { key: 'type', label: 'Type' },
              {
                key: 'approved',
                label: 'Status',
                render: (item: any) => (
                  <Badge className={`border-0 ${item.approved ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'}`}>
                    {item.approved ? 'Approved' : 'Pending'}
                  </Badge>
                )
              },
              {
                key: 'author',
                label: 'Posted By',
                render: (item: any) => item.author?.name || '—'
              },
            ]}
            actions={(item: any) => (
              <div className="flex items-center gap-1">
                {!item.approved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => handleApproveJob(item.id, true)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
                {item.approved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    onClick={() => handleApproveJob(item.id, false)}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteJob(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
            emptyMessage="No job postings found."
          />
        </div>
      )}

      {activeTab === 'mentorships' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Mentorship Monitor</h2>
            <p className="text-muted-foreground text-sm">Track all mentorship activity on the platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              label="Pending"
              value={mentorships.filter(m => m.status === 'pending').length}
              icon={Clock}
              color="from-yellow-500 to-yellow-600"
            />
            <StatsCard
              label="Active"
              value={mentorships.filter(m => m.status === 'accepted').length}
              icon={CheckCircle}
              color="from-green-500 to-green-600"
            />
            <StatsCard
              label="Total"
              value={mentorships.length}
              icon={GraduationCap}
              color="from-blue-500 to-blue-600"
            />
          </div>

          <DataTable
            title="All Mentorships"
            icon={GraduationCap}
            data={mentorships}
            searchPlaceholder="Search mentorships..."
            columns={[
              {
                key: 'student',
                label: 'Student',
                render: (item: any) => item.student?.name || '—'
              },
              {
                key: 'alumni',
                label: 'Alumni Mentor',
                render: (item: any) => item.alumni?.name || '—'
              },
              {
                key: 'status',
                label: 'Status',
                render: (item: any) => (
                  <Badge className={`border-0 capitalize ${
                    item.status === 'accepted' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                    item.status === 'rejected' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                  }`}>{item.status}</Badge>
                )
              },
              {
                key: 'createdAt',
                label: 'Date',
                render: (item: any) => new Date(item.createdAt).toLocaleDateString()
              },
            ]}
            emptyMessage="No mentorships found."
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">System Settings</h2>
            <p className="text-muted-foreground text-sm">Platform configuration and management</p>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Platform Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Platform Version</p>
                  <p className="font-semibold">Alumni360 v1.0.0</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Valid Roles</p>
                  <p className="font-semibold">Student, Alumni, Admin</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Total Users</p>
                  <p className="font-semibold">{analytics?.totalUsers || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Database</p>
                  <p className="font-semibold">PostgreSQL + Prisma</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Pending Job Approvals', value: analytics?.pendingJobs || 0, urgent: true },
                  { label: 'Pending Mentorships', value: analytics?.pendingMentorships || 0, urgent: false },
                  { label: 'Total Events', value: analytics?.totalEvents || 0, urgent: false },
                  { label: 'Total Connections', value: analytics?.totalConnections || 0, urgent: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Badge variant={item.urgent && Number(item.value) > 0 ? 'destructive' : 'secondary'}>
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
