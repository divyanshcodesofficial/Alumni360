import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { authService } from '@/services/authService';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  User, GraduationCap, Users, Building, Shield,
  Mail, Calendar, LogOut, Bell, MessageSquare,
  TrendingUp, Award, BookOpen, Briefcase, Star,
  Activity, Settings, Plus, Eye, Heart, Share2,
  Target, Zap, Globe, Clock, X, Download
} from 'lucide-react';
import CommunityFeed from '@/components/CommunityFeed';
import JobsBoard from '@/components/JobsBoard';
import AlumniDirectory from '@/components/AlumniDirectory';

// ─── Type Definitions ───────────────────────────────────────────────

interface StatItem {
  label: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  color: string;
  progress?: number;
}

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface UserData {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  institution?: string;
  batch_year?: number;
  bio?: string;
  company?: string;
  position?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  profileViews?: number;
}

const roleIcons: Record<string, React.ElementType> = {
  faculty: GraduationCap,
  student: User,
  alumni: Users,
  institution: Building,
  admin: Shield
};

const roleColors: Record<string, string> = {
  faculty: 'bg-blue-500',
  student: 'bg-green-500',
  alumni: 'bg-purple-500',
  institution: 'bg-orange-500',
  admin: 'bg-red-500'
};

// ─── Notifications ─────────────────────────────────────────────

// ─── Dashboard Component ────────────────────────────────────────────

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [adminAnalytics, setAdminAnalytics] = useState<Record<string, number | string> | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load admin analytics
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const load = async () => {
      try {
        setAnalyticsLoading(true);
        const data = await authService.fetchAdminAnalytics();
        setAdminAnalytics(data);
      } catch (e) {
        console.error('Failed to fetch admin analytics', e);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    load();
  }, [user]);

  // Load notifications from API
  useEffect(() => {
    if (!token) return;
    const loadNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setNotifications(data.data);
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };
    loadNotifications();
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const RoleIcon = roleIcons[user.role] || User;
  const stats = user.role === 'admin' && adminAnalytics ? getAdminStatsFromAnalytics(adminAnalytics) : getMockStats(user.role);
  const recentActivities = getMockActivities();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Update Profile':
      case 'Settings':
        setActiveTab('settings');
        break;
      case 'Browse Network':
      case 'Alumni Directory':
        setActiveTab('network');
        break;
      case 'Create Post':
        setActiveTab('community');
        break;
      case 'View Events':
        toast.info('Events calendar coming soon!');
        break;
      case 'Message Center':
        toast.info('Messaging feature coming soon!');
        break;
      case 'Job Board':
      case 'Career Services':
        setActiveTab('jobs');
        break;
      case 'Content':
      case 'Course Materials':
      case 'Course Enrollment':
        setActiveTab('content');
        break;
      default:
        toast.info(`${action} — feature coming soon!`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (e) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: { name: user.name, email: user.email, role: user.role, institution: user.institution },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alumni360_profile_${user.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Profile data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Alumni360</span>
              <Badge variant="secondary" className="ml-2 capitalize font-medium">
                {user.role}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-xl shadow-strong z-50 animate-scale-in">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h4 className="font-semibold text-foreground">Notifications</h4>
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-primary">
                      Mark all read
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                        >
                          <p className="text-sm font-medium text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-semibold">
                  {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${roleColors[user.role] || 'bg-gray-500'} rounded-2xl flex items-center justify-center shadow-xl`}>
                <RoleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-lg text-muted-foreground">
                  Ready to explore your {user.role} dashboard and connect with the community?
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      {stat.change !== undefined && (
                        <Badge variant={stat.change > 0 ? "default" : "destructive"} className="text-xs">
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {stat.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{stat.progress}%</span>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Community</span>
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Jobs</span>
                </TabsTrigger>
                <TabsTrigger value="network" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Network</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Actions Grid */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Get started with common tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {getRoleSpecificActions(user.role).slice(0, 6).map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 hover:scale-105 border-dashed hover:border-solid"
                          onClick={() => handleQuickAction(action.title)}
                        >
                          <div className="p-2 rounded-lg bg-primary/10">
                            <action.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-center">
                            <span className="font-medium text-sm">{action.title}</span>
                            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Recent Posts
                      </CardTitle>
                      <CardDescription>Latest updates from the community</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('community')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                      <p className="text-muted-foreground">No recent posts from your network.</p>
                      <Button variant="link" onClick={() => setActiveTab('community')}>Start a discussion</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="community">
                <CommunityTab />
              </TabsContent>
              
              <TabsContent value="jobs">
                <JobsTab />
              </TabsContent>
              
              <TabsContent value="network">
                <NetworkTab />
              </TabsContent>
              
              <TabsContent value="content">
                <ContentTab />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsTab user={user} onExportData={handleExportData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                  </div>
                ) : (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-full ${activity.color} flex-shrink-0`}>
                        <activity.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <ProfileCompletionCard user={user} onNavigateSettings={() => setActiveTab('settings')} />

            {/* Upcoming Events */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No upcoming events.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
// ─── Profile Completion Component ──────────────────────────────────

const ProfileCompletionCard = ({ user, onNavigateSettings }: { user: UserData; onNavigateSettings: () => void }) => {
  const tasks = [
    { task: 'Add a bio', completed: !!user.bio },
    { task: 'Set your company/institution', completed: !!user.company },
    { task: 'Add your position', completed: !!user.position },
    { task: 'Add your location', completed: !!user.location },
    { task: 'Add skills', completed: !!(user.skills && user.skills.length > 0) },
  ];
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="2"
              />
              <path
                d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
                strokeDasharray={`${percentage}, 100`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{percentage}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {percentage === 100 ? 'Your profile is complete!' : 'Complete your profile to get better connections'}
          </p>
        </div>
        <div className="space-y-3">
          {tasks.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-green-500' : 'bg-muted'
              }`}>
                {item.completed && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
        {percentage < 100 && (
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={onNavigateSettings}>
            Complete Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Helper Functions ──────────────────────────────────────────────

const getMockStats = (role: string): StatItem[] => {
  const roleSpecificStats: Record<string, StatItem[]> = {
    admin: [
      { label: 'Total Users', value: '0', icon: Users, color: 'from-blue-500 to-blue-600' },
      { label: 'Active Sessions', value: '0', icon: Activity, color: 'from-green-500 to-green-600' },
      { label: 'System Health', value: '100%', icon: Shield, color: 'from-purple-500 to-purple-600', progress: 100 },
      { label: 'Reports', value: '0', icon: Award, color: 'from-orange-500 to-orange-600' },
    ],
    faculty: [
      { label: 'Students', value: '0', icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
      { label: 'Courses', value: '0', icon: BookOpen, color: 'from-green-500 to-green-600' },
      { label: 'Avg Rating', value: '0', icon: Star, color: 'from-yellow-500 to-yellow-600' },
      { label: 'Research', value: '0', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    ],
    student: [
      { label: 'Courses', value: '0', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
      { label: 'GPA', value: '0.0', icon: Award, color: 'from-green-500 to-green-600' },
      { label: 'Credits', value: '0', icon: Target, color: 'from-purple-500 to-purple-600', progress: 0 },
      { label: 'Projects', value: '0', icon: Briefcase, color: 'from-orange-500 to-orange-600' },
    ],
    alumni: [
      { label: 'Connections', value: '0', icon: Users, color: 'from-blue-500 to-blue-600' },
      { label: 'Job Posts', value: '0', icon: Briefcase, color: 'from-green-500 to-green-600' },
      { label: 'Experience', value: '0 yrs', icon: Award, color: 'from-purple-500 to-purple-600' },
      { label: 'Network Score', value: '0%', icon: TrendingUp, color: 'from-orange-500 to-orange-600', progress: 0 },
    ],
    institution: [
      { label: 'Programs', value: '0', icon: Building, color: 'from-blue-500 to-blue-600' },
      { label: 'Students', value: '0', icon: GraduationCap, color: 'from-green-500 to-green-600' },
      { label: 'Faculty', value: '0', icon: Users, color: 'from-purple-500 to-purple-600' },
      { label: 'Alumni', value: '0', icon: Award, color: 'from-orange-500 to-orange-600' },
    ],
  };

  return roleSpecificStats[role] || [
    { label: 'Connections', value: '0', icon: Users, color: 'from-blue-500 to-blue-600', progress: 0 },
    { label: 'Posts', value: '0', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { label: 'Events Attended', value: '0', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Profile Views', value: '0', icon: Eye, color: 'from-orange-500 to-orange-600' },
  ];
};

const getMockActivities = (): ActivityItem[] => [];

const getAdminStatsFromAnalytics = (data: Record<string, number | string>): StatItem[] => [
  { label: 'Colleges Registered', value: String(data.collegesRegistered ?? 0), icon: Building, color: 'from-blue-500 to-blue-600' },
  { label: 'Students Registered', value: String(data.studentsRegistered ?? 0), icon: GraduationCap, color: 'from-green-500 to-green-600' },
  { label: 'Alumni Registered', value: String(data.alumniRegistered ?? 0), icon: Users, color: 'from-purple-500 to-purple-600' },
  { label: 'Avg Engagement', value: String(data.averageEngagement ?? '—'), icon: Activity, color: 'from-orange-500 to-orange-600' },
];

// ─── Tab Components ────────────────────────────────────────────────

const NetworkTab = () => (
  <div className="space-y-6">
    <AlumniDirectory />
  </div>
);

const ContentTab = () => (
  <div className="space-y-6">
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Content Library
        </CardTitle>
        <CardDescription>Resources and materials for your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No content yet</h3>
          <p className="text-muted-foreground">Course materials and resources will appear here once created by faculty or admins.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const CommunityTab = () => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-foreground mb-2">Community Feed</h3>
      <p className="text-muted-foreground">Connect, share, and engage with your alumni network</p>
    </div>
    <CommunityFeed />
  </div>
);

const JobsTab = () => (
  <div className="space-y-6">
    <JobsBoard />
  </div>
);

const SettingsTab = ({ user, onExportData }: { user: UserData; onExportData: () => void }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({
    bio: user.bio || '',
    company: user.company || '',
    position: user.position || '',
    location: user.location || '',
    industry: user.industry || '',
    skills: user.skills ? user.skills.join(', ') : ''
  });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...profile,
          skills: skillsArray
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Details
          </CardTitle>
          <CardDescription>Update your public profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company/Institution</label>
              <Input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="e.g., Google" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input value={profile.position} onChange={e => setProfile({...profile, position: e.target.value})} placeholder="e.g., Senior Engineer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="e.g., San Francisco, CA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Input value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} placeholder="e.g., Technology" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="React, Python, Management" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us about yourself..." className="min-h-[100px]" />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-to-r from-primary to-primary/80">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-sm">Data Export</p>
              <p className="text-xs text-muted-foreground">Download your data</p>
            </div>
            <Button size="sm" variant="outline" onClick={onExportData}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm text-red-600">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => toast.error('Action disabled')}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Role-Specific Actions ──────────────────────────────────────────

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
}

const getRoleSpecificActions = (role: string): QuickAction[] => {
  const commonActions: QuickAction[] = [
    { title: 'Update Profile', description: 'Keep your information current', icon: User },
    { title: 'Browse Network', description: 'Connect with other members', icon: Users },
    { title: 'Create Post', description: 'Share updates with community', icon: MessageSquare },
    { title: 'View Events', description: 'Explore upcoming events', icon: Calendar },
    { title: 'Message Center', description: 'Check your messages', icon: Mail },
    { title: 'Settings', description: 'Manage your preferences', icon: Settings },
  ];

  const roleSpecificActions: Record<string, QuickAction[]> = {
    admin: [
      { title: 'User Management', description: 'Manage platform users', icon: Shield },
      { title: 'Analytics', description: 'View system analytics', icon: TrendingUp },
      { title: 'Content', description: 'Review reported content', icon: Eye },
      ...commonActions.slice(0, 3),
    ],
    faculty: [
      { title: 'Student Portal', description: 'Manage student records', icon: GraduationCap },
      { title: 'Course Materials', description: 'Upload course content', icon: BookOpen },
      { title: 'Research Hub', description: 'Collaborate on research', icon: Award },
      ...commonActions.slice(0, 3),
    ],
    student: [
      { title: 'Course Enrollment', description: 'Enroll in new courses', icon: BookOpen },
      { title: 'Career Services', description: 'Get career guidance', icon: Briefcase },
      { title: 'Study Groups', description: 'Join study sessions', icon: Users },
      ...commonActions.slice(0, 3),
    ],
    alumni: [
      { title: 'Mentorship', description: 'Mentor current students', icon: GraduationCap },
      { title: 'Job Board', description: 'Post job opportunities', icon: Briefcase },
      { title: 'Alumni Directory', description: 'Connect with alumni', icon: Users },
      ...commonActions.slice(0, 3),
    ],
    institution: [
      { title: 'Program Management', description: 'Manage academic programs', icon: Building },
      { title: 'Analytics', description: 'View performance metrics', icon: TrendingUp },
      { title: 'Alumni Relations', description: 'Engage with alumni', icon: Users },
      ...commonActions.slice(0, 3),
    ],
  };

  return roleSpecificActions[role] || commonActions;
};

export default Dashboard;
