import { ApiResponse, User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import apiService from './apiService';

class AuthService {
  private readonly BASE_PATH = '/auth';

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiService.post(
      `${this.BASE_PATH}/login`,
      credentials
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    return response.data;
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiService.post(
      `${this.BASE_PATH}/register`,
      userData
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post(`${this.BASE_PATH}/logout`);
    } catch (error) {
      // Ignore logout errors as we'll clear the token anyway
      console.error('Logout error:', error);
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response: ApiResponse<User> = await apiService.get(
      `${this.BASE_PATH}/profile`
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get profile');
    }
    
    return response.data;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response: ApiResponse<User> = await apiService.put(
      `${this.BASE_PATH}/profile`,
      userData
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update profile');
    }
    
    return response.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response: ApiResponse = await apiService.put(
      `${this.BASE_PATH}/change-password`,
      {
        currentPassword,
        newPassword,
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response: ApiResponse<{ token: string }> = await apiService.post(
      `${this.BASE_PATH}/refresh-token`,
      { refreshToken }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to refresh token');
    }
    
    return response.data;
  }

  // Delete user account
  async deleteAccount(password: string): Promise<void> {
    const response: ApiResponse = await apiService.delete(
      `${this.BASE_PATH}/account`,
      {
        data: { password }
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete account');
    }
  }

  // Forgot password (if implemented)
  async forgotPassword(email: string): Promise<void> {
    const response: ApiResponse = await apiService.post(
      `${this.BASE_PATH}/forgot-password`,
      { email }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send reset email');
    }
  }

  // Reset password (if implemented)
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response: ApiResponse = await apiService.post(
      `${this.BASE_PATH}/reset-password`,
      {
        token,
        newPassword,
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to reset password');
    }
  }

  // Verify email (if implemented)
  async verifyEmail(token: string): Promise<void> {
    const response: ApiResponse = await apiService.post(
      `${this.BASE_PATH}/verify-email`,
      { token }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to verify email');
    }
  }

  // Resend verification email (if implemented)
  async resendVerificationEmail(): Promise<void> {
    const response: ApiResponse = await apiService.post(
      `${this.BASE_PATH}/resend-verification`
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to resend verification email');
    }
  }
}

export const authService = new AuthService();
export default authService;