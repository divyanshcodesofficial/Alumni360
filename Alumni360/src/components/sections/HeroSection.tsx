import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal, useAuthModals } from "@/components/modals/AuthModals";
import heroImage from "@/assets/alumni360-hero.jpg";

export const HeroSection = () => {
  const { signUpOpen, signInOpen, openSignUp, openSignIn, closeAll } = useAuthModals();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Alumni360 Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-primary opacity-80"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-secondary/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-16 w-12 h-12 bg-primary-light/30 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-32 left-20 w-8 h-8 bg-secondary-light/40 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Alumni360
            <span className="block text-secondary text-3xl md:text-4xl font-normal mt-2">
              Connecting Alumni, Empowering Institutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Centralized Alumni Data • Lifelong Engagement • Smart Education Impact
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 hover-lift px-8 py-4 text-lg font-semibold rounded-full"
              onClick={openSignUp}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full"
              onClick={openSignIn}
            >
              Sign In
            </Button>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("impact")}
            className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-smooth"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModal isOpen={signUpOpen} onClose={closeAll} type="signup" />
      <AuthModal isOpen={signInOpen} onClose={closeAll} type="signin" />
    </div>
  );
};