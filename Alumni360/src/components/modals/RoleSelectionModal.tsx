import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  GraduationCap, 
  Shield,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

const roles = [
  { id: "student", label: "Student", icon: User, description: "Current students seeking mentorship & opportunities" },
  { id: "alumni", label: "Alumni", icon: GraduationCap, description: "Graduated students ready to mentor & contribute" },
  { id: "admin", label: "Admin", icon: Shield, description: "Platform administrators & moderators" }
];

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectionModal = ({ isOpen, onClose }: RoleSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('form');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in form submitted:', formData, selectedRole);
    onClose();
  };

  const handleClose = () => {
    setStep('role');
    setSelectedRole("");
    setFormData({ email: "", password: "" });
    onClose();
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {step === 'role' ? "Welcome Back" : `Sign In as ${selectedRoleData?.label}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {step === 'role' ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground text-sm">
                Select your role to continue
              </p>
              
              <div className="space-y-3">
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    className="cursor-pointer border hover:border-primary transition-all duration-200 hover-lift group"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-bounce">
                        <role.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                          {role.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  {selectedRoleData && <selectedRoleData.icon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{selectedRoleData?.label}</p>
                  <p className="text-xs text-muted-foreground">{selectedRoleData?.description}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-primary hover:text-primary-dark text-xs"
                >
                  Change
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-border pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-border pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary-dark transition-smooth"
                >
                  Forgot your password?
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-white border-0 hover-glow"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};