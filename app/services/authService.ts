import axios from "axios";
const API_URL = "http://localhost:8080"

axios.defaults.timeout = 30000; // 30 seconds





// JWT token management
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
  }
}


axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url?.startsWith(API_URL)) {
      config.withCredentials = true;
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      config.headers['Accept'] = 'application/json';
    }
    
    console.log('Making API request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      timeout: config.timeout
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      timeout: error.code === 'ECONNABORTED' ? 'Request timed out' : undefined
    });
    return Promise.reject(error);
  }
);


export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
  profile: any; // Could be Member or Admin profile
}

export interface UserRegistrationData {
  username: string;
  password: string;
  email: string;

  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  role: string; 
  dob?: string;
}

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  status: 'PENDING_APPLICATION' | 'APPROVED' | 'REJECTED' | 'DISMISSED';
  profile?: any;
}

export interface MemberProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  school?: any;
  dob?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  console.log(`CREDS: ${credentials}`);
  try {
    console.log("TRYING CREDS: ", credentials);
    const response = await axios.post(`http://localhost:8080/auth/login`, credentials, {
      timeout: 15000 // 15 seconds for login
    });
    const { token, username, role, userId, profile } = response.data;

    console.log('Login response data:', response.data);
    
    // Check account status before setting token
    const userAccount = getUserAccountFromToken(token);
    console.log('User account from token:', userAccount);
    
    // Block login for pending or inactive accounts
    if (userAccount?.status === 'PENDING_APPLICATION') {
      throw new Error('Your account is pending approval. Please wait for an administrator to approve your registration.');
    }
    
    if (userAccount?.isActive === false) {
      throw new Error('Your account has been deactivated. Please contact an administrator.');
    }
    
    if (userAccount?.status === 'REJECTED') {
      throw new Error('Your account registration was denied. Please contact an administrator for more information.');
    }
    
    setToken(token);

    console.log('Role from backend:', role);

    return { token, username, role, userId, profile };
  } catch (error) {
    console.error("Login failed:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error("Login error details:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        code: axiosError.code
      });
    }
    throw error;
  }
};



export const registerUser = async (userData: UserRegistrationData): Promise<any> => {
  try {
    const registrationPayload = {
      username: userData.username,
      password: userData.password,
      role: "USER", 
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number ? String(userData.phone_number) : null,
      address: userData.address || null,
      email: userData.email,
    };

    // Remove undefined values but keep null values
    const cleanedPayload = Object.fromEntries(
      Object.entries(registrationPayload).filter(([_, value]) => value !== undefined)
    );

    console.log("Registration payload being sent:", cleanedPayload);

    const response = await axios.post(`${API_URL}/auth/register`, cleanedPayload, {
      timeout: 30000 // 30 seconds for registration
    });
    
    console.log("Registration response received:");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("Response keys:", Object.keys(response.data));
    
    // Check if we have member ID info
    if (response.data.profile) {
      console.log("Profile data:", response.data.profile);
      console.log("Profile keys:", Object.keys(response.data.profile));
    }
    
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    // Log more details about the error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error("Registration error details:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        code: axiosError.code,
        url: axiosError.config?.url
      });
    }
    throw error;
  }
};

export const logoutUser = (): void => {
  removeToken();
};



export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getToken();
    console.log("What: ", token);
    console.log("Making request to /auth/me with token:", !!token);
    
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
      timeout: 15000, // 15 seconds
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to get current user:", error);
    console.error("getCurrentUser error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      url: error.config?.url
    });
    throw error;
  }
};

// Add new function to get current member profile
export const getCurrentMemberProfile = async (): Promise<MemberProfile | null> => {
  try {
    // Check if we're in the browser and have a token
    if (typeof window === 'undefined') {
      console.log('Server-side rendering, skipping profile fetch');
      return null;
    }

    const token = getToken();
    if (!token) {
      console.log('No token found, user not authenticated');
      return null;
    }

    console.log('Making request to /members/me with token:', !!token);
    console.log('Request URL:', `${API_URL}members/me`);

    const response = await axios.get(`${API_URL}members/me`, {
      timeout: 15000, // 15 seconds
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Member profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get current member profile:', error);
    console.error('getCurrentMemberProfile error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      url: error.config?.url,
      headers: error.config?.headers,
    });
    
    // If token is invalid, clear it
    if (error.response?.status === 401) {
      removeToken();
    }
    
    return null;
  }
};

// Helper function to decode token without setting it
const getUserAccountFromToken = (token: string): UserAccount | null => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    return {
      id: decodedPayload.userId || decodedPayload.sub || decodedPayload.id,
      username: decodedPayload.username || decodedPayload.sub,
      email: decodedPayload.email || '',
      role: decodedPayload.role,
      isActive: decodedPayload.isActive !== false,
      status: decodedPayload.status || 'APPROVED',
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};