import { useState } from "react";
import { Menu, X, Users, UserCheck, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal, useAuthModals } from "@/components/modals/AuthModals";
import { RoleSelectionModal } from "@/components/modals/RoleSelectionModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationProps {
  activeSection: string;
}

const navItems = [
  { id: "hero", label: "Home" },
  { id: "impact", label: "Impact" },
  { id: "challenges", label: "Challenges" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export const Navigation = ({ activeSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { signUpOpen, signInOpen, openSignUp, openSignIn, closeAll } = useAuthModals();
  const { isAuthenticated, user, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Alumni360</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                activeSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant="secondary" className="capitalize">
                  {user?.role}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-primary" 
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={openSignIn}>
                Sign In
              </Button>
              <Button className="gradient-primary text-white border-0 hover-glow" onClick={openSignUp}>
                Sign Up
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10" 
                onClick={() => setIsRoleModalOpen(true)}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Select Role
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-2 text-sm font-medium transition-smooth hover:text-primary ${
                  activeSection === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
                  </div>
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary w-full" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 w-full" onClick={openSignIn}>
                    Sign In
                  </Button>
                  <Button className="gradient-primary text-white border-0 w-full" onClick={openSignUp}>
                    Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10 w-full" 
                    onClick={() => setIsRoleModalOpen(true)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Select Role
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <AuthModal isOpen={signUpOpen} onClose={closeAll} type="signup" />
      <AuthModal isOpen={signInOpen} onClose={closeAll} type="signin" />
      <RoleSelectionModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </nav>
  );
};