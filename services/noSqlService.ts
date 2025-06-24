import type { AverageRatingWithNameProjection } from '~/types/types';

export const getAverageRatingWithCompanyName = async (): Promise<AverageRatingWithNameProjection[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/documents/customer-review/average-rating-with-name`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener los promedios de puntuación');
  }

  return await response.json();
};