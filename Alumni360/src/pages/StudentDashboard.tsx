import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import MentorshipCard from '@/components/dashboard/MentorshipCard';
import AlumniDirectory from '@/components/AlumniDirectory';
import JobsBoard from '@/components/JobsBoard';
import CommunityFeed from '@/components/CommunityFeed';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, Calendar,
  MessageSquare, Settings, Target, Heart, Search, Send,
  User, Eye, Download, BookOpen, TrendingUp, Clock, Zap
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'alumni', label: 'Alumni Directory', icon: Users },
  { id: 'mentorship', label: 'Mentorship', icon: GraduationCap },
  { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>({});
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, mentorRes, eventsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/users/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/users/mentorship/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/users/events`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [statsData, mentorData, eventsData] = await Promise.all([
        statsRes.json(), mentorRes.json(), eventsRes.json()
      ]);
      if (statsData.success) setStats(statsData.data);
      if (mentorData.success) setMentorships(mentorData.data);
      if (eventsData.success) setEvents(eventsData.data);
    } catch (e) {
      console.error('Failed to load student data', e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const profileTasks = [
    { task: 'Add a bio', completed: !!(user as any).bio },
    { task: 'Set your company/institution', completed: !!(user as any).company },
    { task: 'Add your position', completed: !!(user as any).position },
    { task: 'Add your location', completed: !!(user as any).location },
    { task: 'Add skills', completed: !!((user as any).skills && (user as any).skills.length > 0) },
  ];
  const profileComplete = profileTasks.filter(t => t.completed).length;
  const profilePercent = Math.round((profileComplete / profileTasks.length) * 100);

  const pendingMentorships = mentorships.filter(m => m.status === 'pending').length;

  return (
    <DashboardLayout
      navItems={navItems.map(n => ({
        ...n,
        badge: n.id === 'mentorship' ? pendingMentorships : undefined
      }))}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleColor="border-l-2 border-l-green-500"
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent p-6 lg:p-8">
            <div className="relative z-10">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Welcome back, {user.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Explore mentorship opportunities and connect with alumni to boost your career.
              </p>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Connections" value={stats.connections || 0} icon={Users} color="from-blue-500 to-blue-600" />
            <StatsCard label="Mentorship Requests" value={stats.mentorshipsSent || 0} icon={GraduationCap} color="from-green-500 to-green-600" />
            <StatsCard label="Active Mentors" value={stats.mentorshipsAccepted || 0} icon={Heart} color="from-purple-500 to-purple-600" />
            <StatsCard label="Profile Views" value={stats.profileViews || 0} icon={Eye} color="from-orange-500 to-orange-600" />
          </div>

          {/* Quick Actions + Profile Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { title: 'Browse Alumni', icon: Users, tab: 'alumni' },
                      { title: 'Find a Mentor', icon: GraduationCap, tab: 'mentorship' },
                      { title: 'Job Opportunities', icon: Briefcase, tab: 'jobs' },
                      { title: 'Upcoming Events', icon: Calendar, tab: 'events' },
                      { title: 'Community Feed', icon: MessageSquare, tab: 'community' },
                      { title: 'Edit Profile', icon: Settings, tab: 'settings' },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:scale-105 border-dashed hover:border-solid"
                        onClick={() => setActiveTab(action.tab)}
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <action.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-xs">{action.title}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Completion */}
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
                      <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="2" />
                      <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={`${profilePercent}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{profilePercent}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {profileTasks.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500' : 'bg-muted'}`}>
                        {item.completed && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.task}</span>
                    </div>
                  ))}
                </div>
                {profilePercent < 100 && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('settings')}>
                    Complete Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Mentorship Requests */}
          {mentorships.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  My Mentorship Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentorships.slice(0, 3).map(m => (
                  <MentorshipCard key={m.id} mentorship={m} viewAs="student" />
                ))}
                {mentorships.length > 3 && (
                  <Button variant="link" className="w-full" onClick={() => setActiveTab('mentorship')}>
                    View all {mentorships.length} requests
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.filter(e => new Date(e.date) >= new Date()).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No upcoming events.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className={`w-2 h-10 rounded-full ${event.color || 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {event.location && ` · ${event.location}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'alumni' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Alumni Directory</h2>
            <p className="text-muted-foreground text-sm">Search and connect with alumni from your network</p>
          </div>
          <AlumniDirectory />
        </div>
      )}

      {activeTab === 'mentorship' && (
        <MentorshipTab mentorships={mentorships} onRefresh={loadData} />
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Jobs & Internships</h2>
            <p className="text-muted-foreground text-sm">Explore career opportunities posted by alumni</p>
          </div>
          <JobsBoard />
        </div>
      )}

      {activeTab === 'events' && (
        <EventsTab events={events} />
      )}

      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Community Feed</h2>
            <p className="text-muted-foreground text-sm">Connect, share, and engage with your alumni network</p>
          </div>
          <CommunityFeed />
        </div>
      )}

      {activeTab === 'settings' && (
        <SettingsTab />
      )}
    </DashboardLayout>
  );
};

// ─── Mentorship Tab ────────────────────────────────────────────────

const MentorshipTab = ({ mentorships, onRefresh }: { mentorships: any[]; onRefresh: () => void }) => {
  const pending = mentorships.filter(m => m.status === 'pending');
  const accepted = mentorships.filter(m => m.status === 'accepted');
  const rejected = mentorships.filter(m => m.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Mentorship</h2>
        <p className="text-muted-foreground text-sm">Track your mentorship requests and connect with mentors</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Pending" value={pending.length} icon={Clock} color="from-yellow-500 to-yellow-600" />
        <StatsCard label="Accepted" value={accepted.length} icon={Heart} color="from-green-500 to-green-600" />
        <StatsCard label="Total Sent" value={mentorships.length} icon={Send} color="from-blue-500 to-blue-600" />
      </div>

      {mentorships.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">No mentorship requests yet</h3>
            <p className="text-muted-foreground mb-4">Browse the alumni directory to find a mentor and send a request.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mentorships.map(m => (
            <MentorshipCard key={m.id} mentorship={m} viewAs="student" />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Events Tab ────────────────────────────────────────────────────

const EventsTab = ({ events }: { events: any[] }) => {
  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Events & Webinars</h2>
        <p className="text-muted-foreground text-sm">Stay updated with community events</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Upcoming Events</h3>
        {upcoming.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-muted-foreground">No upcoming events.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map(event => (
              <Card key={event.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-1.5 h-14 rounded-full ${event.color || 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  {event.createdBy && (
                    <Badge variant="secondary" className="text-xs">By {event.createdBy.name}</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-muted-foreground mb-3">Past Events</h3>
          <div className="space-y-2 opacity-60">
            {past.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-1 h-8 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Settings Tab ──────────────────────────────────────────────────

const SettingsTab = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    bio: (user as any)?.bio || '',
    company: (user as any)?.company || '',
    position: (user as any)?.position || '',
    location: (user as any)?.location || '',
    industry: (user as any)?.industry || '',
    skills: (user as any)?.skills ? (user as any).skills.join(', ') : ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const skillsArray = profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...profile, skills: skillsArray })
      });
      const data = await res.json();
      if (data.success) {
        // Update stored user
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem('user', JSON.stringify({ ...parsed, ...data.data }));
        }
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      user: { name: user?.name, email: user?.email, role: user?.role },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alumni360_profile_${user?.name?.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Profile data exported!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your profile and account settings</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company/Institution</label>
              <Input value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="e.g., Google" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input value={profile.position} onChange={e => setProfile({...profile, position: e.target.value})} placeholder="e.g., Student / Intern" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} placeholder="e.g., New York, NY" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Input value={profile.industry} onChange={e => setProfile({...profile, industry: e.target.value})} placeholder="e.g., Technology" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="React, Python, Design" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us about yourself..." className="min-h-[100px]" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-primary/80">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div>
              <p className="font-medium text-sm">Data Export</p>
              <p className="text-xs text-muted-foreground">Download your data</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
