import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Linkedin,
  Github,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const AboutSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-20 gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">Alumni360</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're passionate about transforming how educational institutions connect with their alumni, 
            creating vibrant communities that drive lifelong engagement and mutual success.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="gradient-card border-0 shadow-medium hover-lift animate-slide-up">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To revolutionize alumni engagement by creating intelligent, data-driven platforms that foster 
                meaningful connections between educational institutions and their graduates, ultimately enhancing 
                student success and institutional growth through lifelong community building.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-medium hover-lift animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To become the global standard for alumni engagement platforms, empowering every educational 
                institution to build thriving alumni communities that drive innovation, mentorship, and 
                social impact across generations of learners and leaders.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Alumni Network?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="gradient-primary text-white border-0 hover-glow px-8 py-4 text-lg font-semibold rounded-full"
              onClick={scrollToContact}
            >
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-smooth">
                  <Linkedin className="w-5 h-5 text-primary" />
                </Button>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-smooth">
                  <Github className="w-5 h-5 text-primary" />
                </Button>
              </a>
              <a href="mailto:connect.alumni360@gmail.com">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/10 transition-smooth">
                  <Mail className="w-5 h-5 text-primary" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};