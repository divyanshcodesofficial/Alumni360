const API_URL = import.meta.env.VITE_API_URL;
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

// Mock delay for realistic feel
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  batch_year?: number;
  adminSecret?: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  password: string;
  phone: string;
  otp: string;
  name: string;
  role: string;
  batch_year?: number;
  adminSecret?: string;
}

export interface LoginOTPData {
  email: string;
  password: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: 'student' | 'alumni' | 'admin';
    batch_year?: number;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  requiresOTP: boolean;
  phone?: string;
  developmentOTP?: string;
}

export const authService = {
  // Step 1: Send OTP for signup
  signupSendOTP: async (userData: SignupData): Promise<OTPResponse> => {
    if (MOCK_MODE) {
      console.log('📱 Mock Mode: Sending signup OTP for', userData.email);
      await mockDelay();
      
      if (userData.email === 'admin@test.com') {
        throw new Error('Email already exists');
      }
      
      return {
        success: true,
        message: 'OTP sent successfully',
        requiresOTP: true,
        phone: userData.phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2'),
        developmentOTP: '123456'
      };
    }
    
    const response = await fetch(`${API_URL}/auth/signup/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  // Step 2: Verify OTP and complete signup
  signupVerifyOTP: async (otpData: OTPData): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      console.log('✅ Mock Mode: Verifying signup OTP');
      await mockDelay();
      
      if (otpData.otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      return {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000),
          email: otpData.email,
          name: otpData.name,
          phone: otpData.phone,
          role: otpData.role as 'student' | 'alumni' | 'admin',
          batch_year: otpData.batch_year
        }
      };
    }
    
    const response = await fetch(`${API_URL}/auth/signup/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  // Step 1: Send OTP for login
  signinSendOTP: async (credentials: SigninData): Promise<OTPResponse> => {
    if (MOCK_MODE) {
      console.log('📱 Mock Mode: Sending signin OTP for', credentials.email);
      await mockDelay();
      
      if (credentials.email === 'invalid@test.com' || credentials.password === 'wrong') {
        throw new Error('Invalid credentials');
      }
      
      return {
        success: true,
        message: 'OTP sent to your registered phone number',
        requiresOTP: true,
        phone: '+1***456***0',
        developmentOTP: '123456'
      };
    }
    
    const response = await fetch(`${API_URL}/auth/login/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  // Step 2: Verify OTP and complete login
  signinVerifyOTP: async (otpData: LoginOTPData): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      console.log('✅ Mock Mode: Verifying signin OTP');
      await mockDelay();
      
      if (otpData.otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      return {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          email: otpData.email,
          name: 'Test User',
          phone: '+1234567890',
          role: 'student',
          batch_year: 2024
        }
      };
    }
    
    const response = await fetch(`${API_URL}/auth/login/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  // Step 1: Send OTP for admin login
  signinAdminSendOTP: async (credentials: SigninData): Promise<OTPResponse> => {
    if (MOCK_MODE) {
      console.log('📱 Mock Mode: Sending admin signin OTP for', credentials.email);
      await mockDelay();
      
      if (credentials.password === 'wrong') {
        throw new Error('Invalid admin credentials');
      }
      
      return {
        success: true,
        message: 'OTP sent to admin phone number',
        requiresOTP: true,
        phone: '+91***999***0',
        developmentOTP: '123456'
      };
    }

    const response = await fetch(`${API_URL}/auth/admin/login/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
    return data;
  },

  // Step 2: Verify OTP and complete admin login
  signinAdminVerifyOTP: async (otpData: LoginOTPData): Promise<AuthResponse> => {
    if (MOCK_MODE) {
      console.log('✅ Mock Mode: Verifying admin signin OTP');
      await mockDelay();
      
      if (otpData.otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      return {
        token: 'mock_admin_jwt_token_' + Date.now(),
        user: {
          id: 999,
          email: otpData.email,
          name: 'Admin User',
          phone: '+919999999990',
          role: 'admin'
        }
      };
    }

    const response = await fetch(`${API_URL}/auth/admin/login/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Admin login failed');
    return data;
  },

  // Fetch admin analytics
  fetchAdminAnalytics: async (): Promise<Record<string, number | string>> => {
    if (MOCK_MODE) {
      await mockDelay();
      return {
        totalUsers: 0,
        totalStudents: 0,
        totalAlumni: 0,
        totalAdmins: 0,
        totalPosts: 0,
        totalJobs: 0,
        totalEvents: 0,
        totalConnections: 0,
        pendingMentorships: 0,
        activeMentorships: 0,
        pendingJobs: 0,
        recentSignups: 0
      };
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch analytics');
    return data.data || data;
  },

  // Helper function to make authenticated requests
  authenticatedFetch: async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    return response;
  },
};