import { apiClient, USE_API } from './client';
import type { User, UserRole } from '@/src/types';

/**
 * User API service — connects to .NET UsersController
 * Expected endpoints:
 *   GET    /api/users
 *   GET    /api/users/:id
 *   PUT    /api/users/:id/toggle-active
 *   PUT    /api/users/:id/assign-mentor
 *   PUT    /api/users/:id/change-role
 */
export const userService = {
  getAll: async (): Promise<User[]> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  toggleActive: async (id: string): Promise<User> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<User>(`/users/${id}/toggle-active`);
    return data;
  },

  assignMentor: async (studentId: string, mentorId: string): Promise<User> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<User>(`/users/${studentId}/assign-mentor`, {
      mentorId,
    });
    return data;
  },

  changeRole: async (id: string, newRole: UserRole): Promise<User> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<User>(`/users/${id}/change-role`, {
      role: newRole,
    });
    return data;
  },
};
