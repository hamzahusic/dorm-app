import { apiClient, USE_API } from './client';
import type { MealRegistration } from '@/src/types';

/**
 * Registration API service — connects to .NET RegistrationsController
 * Expected endpoints:
 *   GET    /api/registrations?mealId=:mealId
 *   POST   /api/registrations
 *   DELETE /api/registrations/:id
 *   PUT    /api/registrations/:id/collect
 *   PUT    /api/registrations/:id/undo
 */
export const registrationService = {
  getForMeal: async (mealId: string): Promise<MealRegistration[]> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<MealRegistration[]>(`/registrations`, {
      params: { mealId },
    });
    return data;
  },

  register: async (userId: string, mealId: string): Promise<MealRegistration> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.post<MealRegistration>('/registrations', {
      userId,
      mealId,
    });
    return data;
  },

  optOut: async (registrationId: string): Promise<void> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    await apiClient.delete(`/registrations/${registrationId}`);
  },

  markCollected: async (
    registrationId: string,
    collectedVia: 'qr_scan' | 'manual' | 'late_scan',
    verifiedBy: string
  ): Promise<MealRegistration> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<MealRegistration>(
      `/registrations/${registrationId}/collect`,
      { collectedVia, verifiedBy }
    );
    return data;
  },

  undoCollection: async (registrationId: string): Promise<MealRegistration> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<MealRegistration>(
      `/registrations/${registrationId}/undo`
    );
    return data;
  },
};
