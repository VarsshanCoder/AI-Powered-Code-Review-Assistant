class TokenService {
  private readonly TOKEN_KEY = 'ai_code_review_token';
  private readonly REFRESH_TOKEN_KEY = 'ai_code_review_refresh_token';

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Set refresh token in localStorage
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  // Check if token exists
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Decode JWT token (without verification)
  decodeToken(token?: string): any {
    const tokenToUse = token || this.getToken();
    
    if (!tokenToUse) {
      return null;
    }

    try {
      const base64Url = tokenToUse.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token?: string): boolean {
    const decoded = this.decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  // Get token expiration time
  getTokenExpiration(token?: string): Date | null {
    const decoded = this.decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  }

  // Get user ID from token
  getUserId(token?: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  }

  // Get user email from token
  getUserEmail(token?: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.email || null;
  }

  // Get user role from token
  getUserRole(token?: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  // Check if current token is valid
  isValidToken(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Get time until token expires (in milliseconds)
  getTimeUntilExpiration(token?: string): number {
    const expiration = this.getTokenExpiration(token);
    
    if (!expiration) {
      return 0;
    }

    const currentTime = Date.now();
    const timeUntilExpiration = expiration.getTime() - currentTime;
    
    return Math.max(0, timeUntilExpiration);
  }

  // Check if token will expire soon (within 5 minutes)
  willExpireSoon(token?: string, minutesThreshold: number = 5): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    const thresholdMs = minutesThreshold * 60 * 1000;
    
    return timeUntilExpiration <= thresholdMs;
  }

  // Clear all stored tokens
  clearAll(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    
    // Clear any other related data
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('ai_code_review_')
    );
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Store token with automatic cleanup
  setTokenWithCleanup(token: string, refreshToken?: string): void {
    this.setToken(token);
    
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }

    // Set up automatic cleanup when token expires
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    
    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        if (this.getToken() === token) {
          this.removeToken();
        }
      }, timeUntilExpiration);
    }
  }
}

export const tokenService = new TokenService();
export default tokenService;