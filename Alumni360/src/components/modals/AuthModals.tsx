import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  User, 
  GraduationCap, 
  Users, 
  Shield,
  Mail,
  Lock,
  ArrowRight,
  X,
  Loader2,
  Phone
} from "lucide-react";

const roles = [
  { id: "student", label: "Student", icon: User, description: "Current students seeking mentorship & opportunities" },
  { id: "alumni", label: "Alumni", icon: GraduationCap, description: "Graduated students ready to mentor & contribute" },
  { id: "admin", label: "Admin", icon: Shield, description: "Platform administrators & moderators" }
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'signup' | 'signin';
}

export const AuthModal = ({ isOpen, onClose, type }: AuthModalProps) => {
  const { 
    signupSendOTP, signupVerifyOTP,
    signinSendOTP, signinVerifyOTP,
    signinAdminSendOTP, signinAdminVerifyOTP,
    isLoading 
  } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [step, setStep] = useState<'role' | 'form' | 'otp'>('role');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    batch_year: "",
    adminSecret: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [otpData, setOtpData] = useState<{ phone?: string; developmentOTP?: string }>({});

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('form');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole("");
  };

  const handleClose = () => {
    setStep('role');
    setSelectedRole("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      batch_year: "",
      adminSecret: "",
    });
    setSubmitLoading(false);
    setOtpData({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (type === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        // Validate phone number
        if (!formData.phone) {
          toast.error('Phone number is required');
          return;
        }

        // Prepare signup data
        const signupData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: selectedRole,
          ...(formData.batch_year && { batch_year: parseInt(formData.batch_year) }),
          ...(selectedRole === 'admin' && formData.adminSecret && { adminSecret: formData.adminSecret })
        };

        const otpResponse = await signupSendOTP(signupData);
        setOtpData({ phone: otpResponse.phone || formData.phone, developmentOTP: otpResponse.developmentOTP });
        setStep('otp');
        toast.success('OTP sent to your phone number!');
      } else {
        // Sign in - send OTP
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        let otpResponse;
        if (selectedRole === 'admin') {
          otpResponse = await signinAdminSendOTP(credentials);
        } else {
          otpResponse = await signinSendOTP(credentials);
        }
        
        setOtpData({ phone: otpResponse.phone, developmentOTP: otpResponse.developmentOTP });
        setStep('otp');
        toast.success('OTP sent to your registered phone number!');
      }
    } catch (error) {
      console.error(`${type} error:`, error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    setSubmitLoading(true);

    try {
      if (type === 'signup') {
        const otpData = {
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          otp,
          name: formData.name,
          role: selectedRole,
          ...(formData.batch_year && { batch_year: parseInt(formData.batch_year) }),
          ...(selectedRole === 'admin' && formData.adminSecret && { adminSecret: formData.adminSecret })
        };

        await signupVerifyOTP(otpData);
        toast.success('Account created successfully!');
        handleClose();
      } else {
        // Sign in OTP verification
        const otpData = {
          email: formData.email,
          password: formData.password,
          otp
        };

        if (selectedRole === 'admin') {
          await signinAdminVerifyOTP(otpData);
        } else {
          await signinVerifyOTP(otpData);
        }
        
        toast.success('Signed in successfully!');
        handleClose();
      }
    } catch (error) {
      console.error(`OTP verification error:`, error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOTPResend = async () => {
    setSubmitLoading(true);

    try {
      let otpResponse;
      if (type === 'signup') {
        const signupData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: selectedRole,
          ...(formData.batch_year && { batch_year: parseInt(formData.batch_year) }),
          ...(selectedRole === 'admin' && formData.adminSecret && { adminSecret: formData.adminSecret })
        };
        otpResponse = await signupSendOTP(signupData);
      } else {
        const credentials = {
          email: formData.email,
          password: formData.password,
        };
        
        if (selectedRole === 'admin') {
          otpResponse = await signinAdminSendOTP(credentials);
        } else {
          otpResponse = await signinSendOTP(credentials);
        }
      }
      
      setOtpData({ phone: otpResponse.phone, developmentOTP: otpResponse.developmentOTP });
      toast.success('New OTP sent!');
    } catch (error) {
      console.error(`Resend OTP error:`, error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isSignUp = type === 'signup';
  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {step === 'role' ? (
              isSignUp ? "Join Alumni360" : "Welcome Back"
            ) : step === 'otp' ? (
              "Phone Verification"
            ) : (
              `${isSignUp ? 'Sign Up' : 'Sign In'} as ${selectedRoleData?.label}`
            )}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-0 top-0 p-2 hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {step === 'role' ? (
          <div className="space-y-6 animate-fade-in">
            <p className="text-center text-muted-foreground">
              {isSignUp 
                ? "Choose your role to get started with Alumni360" 
                : "Select your role to continue"
              }
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className="cursor-pointer border-2 hover:border-primary transition-all duration-200 hover-lift group"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-bounce">
                      <role.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">
                        {role.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : step === 'otp' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Verify Your Phone Number</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {isSignUp ? "Complete your signup with the verification code" : "Complete your signin with the verification code"}
                </p>
                {otpData.phone && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span className="font-mono">{otpData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Development OTP Display */}
            {otpData.developmentOTP && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  Development Mode: Your OTP is{' '}
                  <span className="font-mono font-bold text-yellow-900 dark:text-yellow-100">{otpData.developmentOTP}</span>
                </p>
              </div>
            )}

            {/* OTP Input Form */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  className="w-full max-w-xs text-center text-2xl font-bold border-2 border-border rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-background"
                  placeholder="Enter 6-digit code"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value;
                    if (value.length === 6) {
                      handleOTPSubmit(value);
                    }
                  }}
                  disabled={submitLoading || isLoading}
                />
              </div>

              <Button
                onClick={() => {
                  const input = document.querySelector('input[maxLength="6"]') as HTMLInputElement;
                  if (input && input.value.length === 6) {
                    handleOTPSubmit(input.value);
                  }
                }}
                disabled={submitLoading || isLoading}
                className="w-full h-12 text-lg font-semibold"
              >
                {submitLoading || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  variant="outline"
                  onClick={handleOTPResend}
                  disabled={submitLoading || isLoading}
                  className="text-primary hover:text-primary-dark"
                >
                  Resend Code
                </Button>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setStep('form')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to form
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                {selectedRoleData && <selectedRoleData.icon className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedRoleData?.label}</p>
                <p className="text-sm text-muted-foreground">{selectedRoleData?.description}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-primary hover:text-primary-dark"
              >
                Change
              </Button>
            </div>

            {isSignUp && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-border"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border-border pl-10"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send a verification code to this number
                  </p>
                </div>

                {(selectedRole === 'alumni' || selectedRole === 'student') && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Batch Year {selectedRole === 'alumni' ? '*' : ''}
                    </label>
                    <Input
                      name="batch_year"
                      type="number"
                      value={formData.batch_year}
                      onChange={handleInputChange}
                      required={selectedRole === 'alumni'}
                      className="border-border"
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                  </div>
                )}

                {selectedRole === 'admin' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Admin Secret Key *
                    </label>
                    <Input
                      name="adminSecret"
                      type="password"
                      value={formData.adminSecret}
                      onChange={handleInputChange}
                      required
                      className="border-border"
                      placeholder="Enter admin secret key"
                    />
                  </div>
                )}
              </>
            )}

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

            {isSignUp && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="border-border pl-10"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-dark transition-smooth"
                  onClick={() => toast.info('Password reset instructions have been sent to your email.')}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitLoading || isLoading}
              className="w-full gradient-primary text-white border-0 hover-glow"
            >
              {submitLoading || isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            {isSignUp && (
              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  className="text-primary hover:text-primary-dark font-medium ml-1 transition-smooth"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Hook to manage auth modals
export const useAuthModals = () => {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const openSignUp = () => {
    setSignInOpen(false);
    setSignUpOpen(true);
  };

  const openSignIn = () => {
    setSignUpOpen(false);
    setSignInOpen(true);
  };

  const closeAll = () => {
    setSignUpOpen(false);
    setSignInOpen(false);
  };

  return {
    signUpOpen,
    signInOpen,
    openSignUp,
    openSignIn,
    closeAll
  };
};