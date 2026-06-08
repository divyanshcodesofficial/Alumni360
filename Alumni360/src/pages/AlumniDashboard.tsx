import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import MentorshipCard from '@/components/dashboard/MentorshipCard';
import CommunityFeed from '@/components/CommunityFeed';
import JobsBoard from '@/components/JobsBoard';
import AlumniDirectory from '@/components/AlumniDirectory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, GraduationCap, Briefcase, Calendar,
  MessageSquare, Settings, Heart, User, Eye, Download,
  Award, TrendingUp, Clock, Zap, Plus, Send, Star
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'mentorship', label: 'Mentorship Requests', icon: GraduationCap },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'jobs', label: 'Job Posting', icon: Briefcase },
  { id: 'network', label: 'Alumni Network', icon: Users },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AlumniDashboard = () => {
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
        fetch('http://localhost:5000/api/users/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/users/mentorship/requests', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/users/events', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [statsData, mentorData, eventsData] = await Promise.all([
        statsRes.json(), mentorRes.json(), eventsRes.json()
      ]);
      if (statsData.success) setStats(statsData.data);
      if (mentorData.success) setMentorships(mentorData.data);
      if (eventsData.success) setEvents(eventsData.data);
    } catch (e) {
      console.error('Failed to load alumni data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorshipResponse = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/mentorship/${id}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Mentorship request ${status}`);
        loadData();
      } else {
        toast.error(data.error || 'Failed to respond');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  if (!user) return null;

  const pendingMentorships = mentorships.filter(m => m.status === 'pending').length;

  return (
    <DashboardLayout
      navItems={navItems.map(n => ({
        ...n,
        badge: n.id === 'mentorship' ? pendingMentorships : undefined
      }))}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      roleColor="border-l-2 border-l-purple-500"
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent p-6 lg:p-8">
            <div className="relative z-10">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Welcome back, {user.name?.split(' ')[0]}! 🎓
              </h1>
              <p className="text-muted-foreground">
                Mentor students, share opportunities, and stay connected with your alumni community.
              </p>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Connections" value={stats.connections || 0} icon={Users} color="from-blue-500 to-blue-600" />
            <StatsCard label="Mentorship Requests" value={stats.mentorshipsReceived || 0} icon={GraduationCap} color="from-purple-500 to-purple-600" />
            <StatsCard label="Jobs Posted" value={stats.jobsPosted || 0} icon={Briefcase} color="from-green-500 to-green-600" />
            <StatsCard label="Events Created" value={stats.eventsCreated || 0} icon={Calendar} color="from-orange-500 to-orange-600" />
          </div>

          {/* Quick Actions + Contribution */}
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
                      { title: 'Mentorship Requests', icon: GraduationCap, tab: 'mentorship' },
                      { title: 'Create Event', icon: Calendar, tab: 'events' },
                      { title: 'Post a Job', icon: Briefcase, tab: 'jobs' },
                      { title: 'Alumni Network', icon: Users, tab: 'network' },
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

            {/* Contribution Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: 'Students Mentored', value: stats.mentorshipsAccepted || 0, icon: Heart },
                    { label: 'Jobs Posted', value: stats.jobsPosted || 0, icon: Briefcase },
                    { label: 'Events Created', value: stats.eventsCreated || 0, icon: Calendar },
                    { label: 'Profile Views', value: stats.profileViews || 0, icon: Eye },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Mentorship Requests */}
          {mentorships.filter(m => m.status === 'pending').length > 0 && (
            <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-yellow-600" />
                  Pending Mentorship Requests
                  <Badge className="bg-yellow-500 text-white">{pendingMentorships}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mentorships.filter(m => m.status === 'pending').slice(0, 3).map(m => (
                  <MentorshipCard
                    key={m.id}
                    mentorship={m}
                    viewAs="alumni"
                    onAccept={(id) => handleMentorshipResponse(id, 'accepted')}
                    onReject={(id) => handleMentorshipResponse(id, 'rejected')}
                  />
                ))}
                {pendingMentorships > 3 && (
                  <Button variant="link" className="w-full" onClick={() => setActiveTab('mentorship')}>
                    View all {pendingMentorships} pending requests
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'mentorship' && (
        <MentorshipManagement
          mentorships={mentorships}
          onAccept={(id) => handleMentorshipResponse(id, 'accepted')}
          onReject={(id) => handleMentorshipResponse(id, 'rejected')}
        />
      )}

      {activeTab === 'events' && (
        <EventManagement events={events} onRefresh={loadData} />
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Job Posting</h2>
            <p className="text-muted-foreground text-sm">Post and manage job opportunities for students</p>
          </div>
          <JobsBoard />
        </div>
      )}

      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Alumni Network</h2>
            <p className="text-muted-foreground text-sm">Connect with fellow alumni</p>
          </div>
          <AlumniDirectory />
        </div>
      )}

      {activeTab === 'community' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Community Feed</h2>
            <p className="text-muted-foreground text-sm">Share updates and engage with the community</p>
          </div>
          <CommunityFeed />
        </div>
      )}

      {activeTab === 'settings' && (
        <AlumniSettingsTab />
      )}
    </DashboardLayout>
  );
};

// ─── Mentorship Management ─────────────────────────────────────────

const MentorshipManagement = ({ mentorships, onAccept, onReject }: {
  mentorships: any[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const filtered = filter === 'all' ? mentorships : mentorships.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Mentorship Requests</h2>
        <p className="text-muted-foreground text-sm">Manage mentorship requests from students</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard label="Total" value={mentorships.length} icon={Users} color="from-blue-500 to-blue-600" />
        <StatsCard label="Pending" value={mentorships.filter(m => m.status === 'pending').length} icon={Clock} color="from-yellow-500 to-yellow-600" />
        <StatsCard label="Accepted" value={mentorships.filter(m => m.status === 'accepted').length} icon={Heart} color="from-green-500 to-green-600" />
        <StatsCard label="Declined" value={mentorships.filter(m => m.status === 'rejected').length} icon={TrendingUp} color="from-red-500 to-red-600" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No {filter === 'all' ? '' : filter} mentorship requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <MentorshipCard
              key={m.id}
              mentorship={m}
              viewAs="alumni"
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Event Management ──────────────────────────────────────────────

const EventManagement = ({ events, onRefresh }: { events: any[]; onRefresh: () => void }) => {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Event created successfully!');
        setFormData({ title: '', description: '', date: '', location: '' });
        setShowForm(false);
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to create event');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Events</h2>
          <p className="text-muted-foreground text-sm">Create and manage events for the community</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm border-l-4 border-l-primary">
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Title *</label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g., Alumni Meetup 2025" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g., Virtual / New York, NY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the event..." className="min-h-[80px]" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Event'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {events.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground">Create your first event to engage the community.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <Card key={event.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-1.5 h-14 rounded-full ${event.color || 'bg-blue-500'}`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{event.title}</h4>
                  {event.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                <Badge variant={new Date(event.date) >= new Date() ? 'default' : 'secondary'}>
                  {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Alumni Settings Tab ───────────────────────────────────────────

const AlumniSettingsTab = () => {
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
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...profile, skills: skillsArray })
      });
      const data = await res.json();
      if (data.success) {
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
        <h2 className="text-xl font-bold text-foreground">Profile & Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your professional profile</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Professional Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
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
            <Input value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="Leadership, React, Python" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us about your career journey..." className="min-h-[100px]" />
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
        <CardContent>
          <div className="flex items-center justify-between py-3">
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

export default AlumniDashboard;
