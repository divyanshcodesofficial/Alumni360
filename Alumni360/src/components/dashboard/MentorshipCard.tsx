import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface MentorshipUser {
  id: number;
  name: string;
  email: string;
  company?: string;
  position?: string;
  industry?: string;
  skills?: string[];
  batch_year?: number;
  bio?: string;
}

interface MentorshipData {
  id: number;
  status: string;
  message?: string;
  createdAt: string;
  student: MentorshipUser;
  alumni: MentorshipUser;
}

interface MentorshipCardProps {
  mentorship: MentorshipData;
  viewAs: 'student' | 'alumni' | 'admin';
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'Pending' },
  accepted: { color: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: CheckCircle, label: 'Accepted' },
  rejected: { color: 'bg-red-500/10 text-red-700 dark:text-red-400', icon: XCircle, label: 'Declined' },
};

const MentorshipCard = ({ mentorship, viewAs, onAccept, onReject }: MentorshipCardProps) => {
  const status = statusConfig[mentorship.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Who to display depends on the viewer's role
  const displayUser = viewAs === 'student' ? mentorship.alumni : mentorship.student;
  const initials = displayUser.name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-foreground truncate">{displayUser.name}</h4>
              <Badge className={`${status.color} border-0 flex items-center gap-1 text-xs`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </Badge>
            </div>

            {viewAs === 'student' && displayUser.position && (
              <p className="text-sm text-muted-foreground">
                {displayUser.position}{displayUser.company ? ` at ${displayUser.company}` : ''}
              </p>
            )}
            {viewAs === 'alumni' && displayUser.batch_year && (
              <p className="text-sm text-muted-foreground">
                Batch {displayUser.batch_year}
              </p>
            )}

            {mentorship.message && (
              <div className="mt-2 p-2.5 rounded-lg bg-muted/50 text-sm text-foreground flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{mentorship.message}</span>
              </div>
            )}

            {displayUser.skills && displayUser.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {displayUser.skills.slice(0, 4).map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                ))}
                {displayUser.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">+{displayUser.skills.length - 4}</Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(mentorship.createdAt).toLocaleDateString()}
              </p>

              {viewAs === 'alumni' && mentorship.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onReject?.(mentorship.id)}>
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Decline
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onAccept?.(mentorship.id)}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorshipCard;
