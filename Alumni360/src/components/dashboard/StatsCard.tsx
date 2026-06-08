import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string; // gradient like 'from-blue-500 to-blue-600'
  change?: number;
  subtitle?: string;
}

const StatsCard = ({ label, value, icon: Icon, color, change, subtitle }: StatsCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm bg-gradient-to-br from-card to-muted/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {change !== undefined && (
                <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
                  {change >= 0 ? '+' : ''}{change}%
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
