import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, MessageCircle } from "lucide-react";
import dashboardImage from "@/assets/dashboard-mockup.jpg";
import { useAuthModals } from "@/components/modals/AuthModals";

export const ImpactSection = () => {
  const { openSignUp } = useAuthModals();

  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            See the <span className="text-primary">Impact</span> in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our intuitive dashboard brings together all aspects of alumni engagement in one powerful, 
            user-friendly interface designed for maximum impact and ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Dashboard Mockup */}
          <div className="animate-slide-up">
            <div className="relative">
              <img
                src={dashboardImage}
                alt="Alumni360 Dashboard"
                className="w-full rounded-2xl shadow-strong hover-lift"
              />
              <div className="absolute inset-0 gradient-primary opacity-10 rounded-2xl"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute -top-4 -right-4 bg-background shadow-medium rounded-lg p-4 animate-float border border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Live Updates</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-background shadow-medium rounded-lg p-4 animate-float border border-border" style={{ animationDelay: "1s" }}>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">2,847 Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-bounce">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                  Dynamic Alumni Profiles
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time profile updates with LinkedIn & GitHub integration, showcasing career progression, 
                  skills, and achievements in an interactive, searchable format.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-bounce">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                  Intelligent Event Calendar
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Smart event management system with automated reminders, personalized recommendations, 
                  and seamless registration workflows for maximum attendance.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-bounce">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                  Mentorship Hub
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered matching system connecting alumni mentors with students and recent graduates 
                  based on career paths, skills, and professional interests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            className="gradient-primary text-white border-0 hover-glow px-8 py-4 text-lg font-semibold rounded-full"
            onClick={openSignUp}
          >
            View Live Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};