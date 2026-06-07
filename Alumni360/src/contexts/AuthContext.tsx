import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse, OTPResponse, SignupData, OTPData, SigninData, LoginOTPData } from '@/services/authService';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  institution?: string;
  batch_year?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  // 2FA methods
  signupSendOTP: (userData: SignupData) => Promise<OTPResponse>;
  signupVerifyOTP: (otpData: OTPData) => Promise<void>;
  signinSendOTP: (credentials: SigninData) => Promise<OTPResponse>;
  signinVerifyOTP: (otpData: LoginOTPData) => Promise<void>;
  signinAdminSendOTP: (credentials: SigninData) => Promise<OTPResponse>;
  signinAdminVerifyOTP: (otpData: LoginOTPData) => Promise<void>;
  // Legacy methods (kept for backward compatibility)
  signup: (userData: SignupData) => Promise<void>;
  signin: (credentials: SigninData) => Promise<void>;
  signinAdmin: (credentials: SigninData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    const dashboardPath = getDashboardPath(userData.role);
    navigate(dashboardPath);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
    toast.info('You have been logged out');
  };

  // 2FA Methods
  const signupSendOTP = async (userData: SignupData): Promise<OTPResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.signupSendOTP(userData);
      return response;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupVerifyOTP = async (otpData: OTPData): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.signupVerifyOTP(otpData);
      login(response.token, response.user);
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signinSendOTP = async (credentials: SigninData): Promise<OTPResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.signinSendOTP(credentials);
      return response;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signinVerifyOTP = async (otpData: LoginOTPData): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.signinVerifyOTP(otpData);
      login(response.token, response.user);
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signinAdminSendOTP = async (credentials: SigninData): Promise<OTPResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.signinAdminSendOTP(credentials);
      return response;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid OTP');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signinAdminVerifyOTP = async (otpData: LoginOTPData): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.signinAdminVerifyOTP(otpData);
      login(response.token, response.user);
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy methods for backward compatibility
  const signup = async (userData: SignupData) => {
    // Legacy method, should use OTP flow instead
    toast.error('Direct signup is disabled. Please use OTP verification.');
  };

  const signin = async (credentials: SigninData) => {
    // Legacy method, should use OTP flow instead
    toast.error('Direct signin is disabled. Please use OTP verification.');
  };

  const signinAdmin = async (credentials: SigninData) => {
    // This should now use the 2FA flow
    const otpResponse = await signinAdminSendOTP(credentials);
    throw new Error('Please use the new 2FA admin signin flow');
  };

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'faculty':
        return '/faculty-dashboard';
      case 'student':
        return '/student-dashboard';
      case 'alumni':
        return '/alumni-dashboard';
      case 'institution':
        return '/institution-dashboard';
      default:
        return '/dashboard';
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading,
    // 2FA methods
    signupSendOTP,
    signupVerifyOTP,
    signinSendOTP,
    signinVerifyOTP,
    signinAdminSendOTP,
    signinAdminVerifyOTP,
    // Legacy methods
    signup,
    signin,
    signinAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};