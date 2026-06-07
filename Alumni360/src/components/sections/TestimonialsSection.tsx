import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuthModals } from "@/components/modals/AuthModals";

export const TestimonialsSection = () => {
  const { openSignUp } = useAuthModals();

  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Building <span className="text-primary">Alumni Communities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Alumni360 empowers institutions to create meaningful connections and foster 
            lifelong engagement through innovative technology and community-driven features.
          </p>
        </div>

        {/* Community Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="gradient-card border-0 shadow-soft hover-lift animate-slide-up">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Dynamic Alumni Profiles
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive alumni profiles that showcase professional achievements, 
                current roles, and expertise to facilitate meaningful connections.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft hover-lift animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Mentorship Networks
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect experienced alumni with current students and recent graduates 
                through structured mentorship programs and guidance initiatives.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft hover-lift animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Event Management
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Streamlined event planning and management tools for reunions, 
                networking events, and professional development sessions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="gradient-card border-0 shadow-strong text-center animate-fade-in">
          <CardContent className="p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Ready to Transform Your Alumni Engagement?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join institutions worldwide in creating vibrant alumni communities that 
              drive success for both graduates and current students.
            </p>
            <Button 
              size="lg" 
              className="gradient-primary text-white border-0 hover-glow px-8 py-4 text-lg font-semibold rounded-full"
              onClick={openSignUp}
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};