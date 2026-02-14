import { apiClient, USE_API } from './client';
import type { Meal } from '@/src/types';

export interface CreateMealDto {
  mealName: string;
  description: string | null;
  date: string;
  createdBy: string;
}

export interface UpdateMealDto {
  mealName?: string;
  description?: string | null;
  date?: string;
}

/**
 * Meal API service — connects to .NET MealsController
 * Expected endpoints:
 *   GET    /api/meals
 *   GET    /api/meals/:id
 *   POST   /api/meals
 *   PUT    /api/meals/:id
 *   DELETE /api/meals/:id
 */
export const mealService = {
  getAll: async (): Promise<Meal[]> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<Meal[]>('/meals');
    return data;
  },

  getById: async (id: string): Promise<Meal> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<Meal>(`/meals/${id}`);
    return data;
  },

  create: async (meal: CreateMealDto): Promise<Meal> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.post<Meal>('/meals', meal);
    return data;
  },

  update: async (id: string, updates: UpdateMealDto): Promise<Meal> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<Meal>(`/meals/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    await apiClient.delete(`/meals/${id}`);
  },
};
