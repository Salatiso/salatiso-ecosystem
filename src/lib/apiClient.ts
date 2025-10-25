import { ApiResponse } from '@/lib/api';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User APIs
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile');
  }

  async updateUserProfile(updates: any): Promise<ApiResponse<any>> {
    return this.request('/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Family APIs
  async getFamilyInfo(): Promise<ApiResponse<any>> {
    return this.request('/family/info');
  }

  async createFamilyUpdate(update: {
    title: string;
    content: string;
    type?: string;
    priority?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/family/updates', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }

  // Course APIs
  async getCourses(params?: {
    category?: string;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/courses${query ? `?${query}` : ''}`);
  }

  async updateCourseProgress(progress: {
    courseId: string;
    lessonId: string;
    progress?: number;
    completed?: boolean;
    score?: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/courses/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  // Project APIs
  async createProject(project: {
    name: string;
    description?: string;
    type: string;
    category?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/projects/create', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProjects(params?: {
    status?: string;
    type?: string;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  // Analytics APIs
  async getAnalyticsDashboard(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.request(`/analytics/dashboard?period=${period}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };

// React hooks for API calls
export const useApi = () => {
  return {
    // User APIs
    getUserProfile: () => apiClient.getUserProfile(),
    updateUserProfile: (updates: any) => apiClient.updateUserProfile(updates),

    // Family APIs
    getFamilyInfo: () => apiClient.getFamilyInfo(),
    createFamilyUpdate: (update: any) => apiClient.createFamilyUpdate(update),

    // Course APIs
    getCourses: (params?: any) => apiClient.getCourses(params),
    updateCourseProgress: (progress: any) => apiClient.updateCourseProgress(progress),

    // Project APIs
    createProject: (project: any) => apiClient.createProject(project),
    getProjects: (params?: any) => apiClient.getProjects(params),

    // Analytics APIs
    getAnalyticsDashboard: (period?: string) => apiClient.getAnalyticsDashboard(period),
  };
};