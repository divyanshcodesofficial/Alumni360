import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthModal, useAuthModals } from "@/components/modals/AuthModals";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Building,
  ArrowRight,
  Send,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch with our team",
    contact: "connect.alumni360@gmail.com",
    action: "Send Email",
    href: "mailto:connect.alumni360@gmail.com"
  },
  {
    icon: Phone,
    title: "Call Us", 
    description: "Speak with an expert",
    contact: "+91 7007145766",
    action: "Schedule Call",
    href: "tel:+917007145766"
  }
];

const partnershipTypes = [
  {
    icon: Building,
    title: "Institutional Partnership",
    description: "Transform your alumni engagement with our comprehensive platform solution",
    features: ["Full platform access", "Custom branding", "Dedicated support", "Training & onboarding"]
  },
  {
    icon: Users,
    title: "Technology Partnership", 
    description: "Integrate Alumni360 with your existing systems and expand our ecosystem",
    features: ["API access", "White-label options", "Revenue sharing", "Co-marketing opportunities"]
  },
  {
    icon: Calendar,
    title: "Pilot Program",
    description: "Start small with a pilot program to experience Alumni360's impact firsthand",
    features: ["3-month trial", "Limited user access", "Basic analytics", "Implementation support"]
  }
];

export const ContactSection = () => {
  const { signUpOpen, signInOpen, openSignUp, openSignIn, closeAll } = useAuthModals();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "",
    message: "",
    partnershipType: "institutional"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true';

      if (isMockMode) {
        // Mock mode: simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        toast.success("Your request has been submitted successfully!");
      } else {
        const response = await fetch(`${apiUrl}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        setIsSubmitted(true);
        toast.success("Your request has been submitted successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        institution: "",
        role: "",
        message: "",
        partnershipType: "institutional",
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again later.");
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-20 gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Partner With <span className="text-primary">Alumni360</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to transform your alumni engagement? Let's discuss how Alumni360 can drive 
            meaningful connections and measurable results for your institution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="gradient-card border-0 shadow-strong animate-slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Get Started Today
              </h3>
              
              {isSubmitted ? (
                <div className="text-center py-12 animate-scale-in">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    Thank You!
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    We've received your request and will get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary border-primary hover:bg-primary/10"
                  >
                    Send Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Institution *
                      </label>
                      <Input
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                        placeholder="University/College name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Your Role *
                      </label>
                      <Input
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                        placeholder="e.g., Alumni Director"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Partnership Interest
                    </label>
                    <select
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    >
                      <option value="institutional">Institutional Partnership</option>
                      <option value="technology">Technology Partnership</option>
                      <option value="pilot">Pilot Program</option>
                      <option value="demo">Request Demo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-background border-border resize-none"
                      placeholder="Tell us about your alumni engagement goals..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full gradient-primary text-white border-0 hover-glow"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Request
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our{" "}
                    <a href="/privacy-policy" className="text-primary hover:underline">privacy policy</a>
                    {" "}and{" "}
                    <a href="/terms-of-service" className="text-primary hover:underline">terms of service</a>.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information & Partnership Types */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Get In Touch
              </h3>
              {contactInfo.map((info, index) => (
                <a key={index} href={info.href} className="block">
                  <Card className="gradient-card border-0 shadow-soft hover-lift group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-bounce">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-smooth">
                            {info.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            {info.description}
                          </p>
                          <p className="font-medium text-primary">
                            {info.contact}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            {/* Partnership Options */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Partnership Options
              </h3>
              <div className="space-y-4">
                {partnershipTypes.map((type, index) => (
                  <Card 
                    key={index} 
                    className="gradient-card border-0 shadow-soft hover-lift"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <type.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-2">
                            {type.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {type.features.map((feature, featureIndex) => (
                              <span 
                                key={featureIndex}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <Card className="gradient-card border-0 shadow-strong text-center animate-fade-in">
          <CardContent className="p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to See Alumni360 in Action?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a personalized demo to see how Alumni360 can transform your 
              institution's alumni engagement and drive meaningful results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="gradient-primary text-white border-0 hover-glow px-8 py-4 text-lg font-semibold rounded-full"
                onClick={openSignUp}
              >
                Join Alumni360 Now
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold rounded-full"
                onClick={openSignIn}
              >
                Already A Member? Sign In
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Modals */}
        <AuthModal isOpen={signUpOpen} onClose={closeAll} type="signup" />
        <AuthModal isOpen={signInOpen} onClose={closeAll} type="signin" />
      </div>
    </div>
  );
};