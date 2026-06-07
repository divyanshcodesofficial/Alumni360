import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Briefcase, MapPin, Clock, DollarSign, Building2, Users, Calendar, Search, Plus, ExternalLink, Send, Zap, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  remote: boolean;
  urgent: boolean;
  createdAt: string;
  author: {
    name: string;
    role: string;
    company: string;
  };
}

const JobsBoard: React.FC = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [showPostJob, setShowPostJob] = useState(false);
  
  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', type: 'Full-time', experience: 'Entry Level', salary: '', description: '', remote: false
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.description) return;

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      });
      const data = await res.json();
      if (data.success) {
        setJobs([data.data, ...jobs]);
        setNewJob({ title: '', company: '', location: '', type: 'Full-time', experience: 'Entry Level', salary: '', description: '', remote: false });
        setShowPostJob(false);
        toast.success('Job posted successfully!');
      }
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesExperience = selectedExperience === 'all' || job.experience === selectedExperience;
    return matchesSearch && matchesType && matchesExperience;
  });

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading jobs...</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Jobs & Internships</h2>
            <p className="text-muted-foreground">Discover opportunities from our alumni network</p>
          </div>
          
          <Dialog open={showPostJob} onOpenChange={setShowPostJob}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="w-4 h-4 mr-2" /> Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>Share job opportunities with the alumni community</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Title *</label>
                    <Input value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company *</label>
                    <Input value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Salary Range</label>
                    <Input value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select value={newJob.type} onValueChange={(value: any) => setNewJob({ ...newJob, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <Select value={newJob.experience} onValueChange={(value: any) => setNewJob({ ...newJob, experience: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Description *</label>
                  <Textarea value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="min-h-[100px]" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowPostJob(false)}>Cancel</Button>
                  <Button onClick={handlePostJob} disabled={!newJob.title || !newJob.company || !newJob.description}>Post Job</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search jobs, companies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Job Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Experience" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Entry Level">Entry Level</SelectItem>
              <SelectItem value="Senior Level">Senior Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or post a new job.</p>
          </div>
        )}

        {filteredJobs.map((job) => (
          <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        {job.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building2 className="w-4 h-4" /> <span className="font-medium">{job.company}</span>
                        <span>•</span> <MapPin className="w-4 h-4" /> <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> <Badge variant="secondary" className="text-xs">{job.type}</Badge></div>
                        <div className="flex items-center gap-1"><Target className="w-3 h-3" /> <Badge variant="secondary" className="text-xs">{job.experience}</Badge></div>
                        {job.salary && <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> <span className="font-medium">{job.salary}</span></div>}
                      </div>
                    </div>
                  </div>
                  <div className="ml-16">
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>
                  </div>
                  <div className="ml-16 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
                            {job.author?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span>Posted by {job.author?.name}</span>
                      </div>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                      <Send className="w-4 h-4 mr-2" /> Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsBoard;