import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, Briefcase, GraduationCap, Users, UserPlus, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AlumniMember {
  id: number;
  name: string;
  role: string;
  company?: string;
  position?: string;
  location?: string;
  batch_year?: number;
  industry?: string;
  skills: string[];
  bio?: string;
  profileViews: number;
  isConnected?: boolean;
}

const AlumniDirectory: React.FC = () => {
  const { user, token } = useAuth();
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/directory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAlumni(data.data.filter((u: any) => u.id !== user?.id)); // Exclude self
      }
    } catch (error) {
      console.error('Failed to fetch directory', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (memberId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/connect/${memberId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAlumni(alumni.map(member => member.id === memberId ? { ...member, isConnected: true } : member));
        toast.success('Connection request sent!');
      }
    } catch (error) {
      toast.error('Failed to send connection request');
    }
  };

  const filteredAlumni = alumni.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (member.company || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (member.skills || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || member.industry === selectedIndustry;
    const matchesLocation = selectedLocation === 'all' || member.location === selectedLocation;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  const industries = Array.from(new Set(alumni.map(a => a.industry).filter(Boolean)));
  const locations = Array.from(new Set(alumni.map(a => a.location).filter(Boolean)));

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading directory...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Alumni Directory</h2>
        <p className="text-muted-foreground">Connect with {alumni.length} alumni from our network</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, company, or skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Industry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No alumni found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria, or be the first to complete your profile!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlumni.map((member) => (
            <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-lg">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          {member.position && <><Briefcase className="w-3 h-3" /> <span className="font-medium">{member.position}</span></>}
                          {member.company && <><span>at</span> <span className="font-medium">{member.company}</span></>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {member.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> <span>{member.location}</span></div>}
                          {member.batch_year && <div className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> <span>Class of {member.batch_year}</span></div>}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline" size="sm"
                        onClick={() => handleConnect(member.id)}
                        disabled={member.isConnected}
                        className={member.isConnected ? 'border-green-500 text-green-600' : ''}
                      >
                        {member.isConnected ? 'Request Sent' : <><UserPlus className="w-4 h-4 mr-2" /> Connect</>}
                      </Button>
                    </div>

                    <div className="space-y-3 mt-3">
                      {member.bio && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{member.bio}</p>}

                      <div className="flex flex-wrap gap-1">
                        {(member.skills || []).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;