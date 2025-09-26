import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenService } from './tokenService';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          tokenService.removeToken();
          // Redirect to login page
          window.location.href = '/login';
        }

        // Handle network errors
        if (!error.response) {
          error.message = 'Network error. Please check your connection.';
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }

  // File upload
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(progress);
      };
    }

    return this.api.post(url, formData, config);
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Set base URL
  setBaseURL(baseURL: string): void {
    this.api.defaults.baseURL = baseURL;
  }

  // Get base URL
  getBaseURL(): string | undefined {
    return this.api.defaults.baseURL;
  }

  // Set timeout
  setTimeout(timeout: number): void {
    this.api.defaults.timeout = timeout;
  }

  // Add custom header
  setHeader(key: string, value: string): void {
    this.api.defaults.headers.common[key] = value;
  }

  // Remove custom header
  removeHeader(key: string): void {
    delete this.api.defaults.headers.common[key];
  }

  // Cancel requests
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Check if error is a cancel error
  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }
}

export const apiService = new ApiService();
export default apiService;