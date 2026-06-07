import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  Database, 
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const challenges = [
  {
    icon: Shield,
    title: "Data Privacy & Security",
    description: "Ensuring complete compliance with data protection regulations while maintaining user trust and platform functionality.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "User Adoption & Engagement",
    description: "Driving consistent participation across diverse alumni demographics and maintaining long-term platform engagement.",
    color: "text-secondary"
  },
  {
    icon: Database,
    title: "Data Accuracy & Completeness",
    description: "Maintaining up-to-date, accurate alumni information across changing career paths and contact details.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Engagement Fatigue Prevention",
    description: "Avoiding platform saturation and maintaining fresh, relevant interactions that provide genuine value to users.",
    color: "text-secondary"
  }
];

const mitigationStrategies = [
  "Phased rollout with pilot institutions",
  "Continuous user feedback integration",
  "Robust customer support system",
  "Regular platform updates and improvements",
  "Strategic partnerships for enhanced features"
];

export const ChallengesSection = () => {
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Addressing <span className="text-primary">Key Challenges</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We've identified critical challenges in alumni engagement and developed comprehensive 
            strategies to address each concern with innovative, user-centric solutions.
          </p>
        </div>

        {/* Key Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {challenges.map((item, index) => (
            <Card 
              key={index} 
              className="gradient-card border-0 shadow-soft hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${item.color === 'text-primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Mitigation */}
        <div className="animate-slide-up">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Risk Mitigation Strategies
          </h3>
          <div className="space-y-4">
            {mitigationStrategies.map((strategy, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-muted-foreground">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};