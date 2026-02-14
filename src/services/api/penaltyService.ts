import { apiClient, USE_API } from './client';
import type { Penalty } from '@/src/types';

/**
 * Penalty API service — connects to .NET PenaltiesController
 * Expected endpoints:
 *   GET    /api/penalties
 *   GET    /api/penalties?userId=:userId
 *   PUT    /api/penalties/:id/clear
 */
export const penaltyService = {
  getAll: async (): Promise<Penalty[]> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<Penalty[]>('/penalties');
    return data;
  },

  getForUser: async (userId: string): Promise<Penalty[]> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.get<Penalty[]>('/penalties', {
      params: { userId },
    });
    return data;
  },

  clear: async (penaltyId: string, clearedBy: string, reason: string): Promise<Penalty> => {
    if (!USE_API) throw new Error('API not enabled — using mock data');
    const { data } = await apiClient.put<Penalty>(`/penalties/${penaltyId}/clear`, {
      clearedBy,
      reason,
    });
    return data;
  },
};
