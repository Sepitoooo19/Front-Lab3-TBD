import type { AverageRatingWithNameProjection, CustomerReviewDocument, RapidChangeOrderDTO, DealerFrequentLocation, ClientNavigationDocument, ReviewHourStats  } from '~/types/types';

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


export const searchCustomerReviewsByKeywords = async (keywords: string[]): Promise<CustomerReviewDocument[]> => {
  const config = useRuntimeConfig();
  const query = new URLSearchParams();
  keywords.forEach(word => query.append('keywords', word));

  const response = await fetch(`${config.public.apiBase}/documents/customer-review/search?${query.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al buscar opiniones por palabra clave');
  }

  return await response.json();
};

export const getOrdersWithRapidChanges = async (): Promise<RapidChangeOrderDTO[]> => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.apiBase}/documents/order-log/rapid-change-details`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos con cambios rápidos');
  }

  return await response.json();
};


export const getDealerFrequentLocations = async (): Promise<DealerFrequentLocation[]> => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.apiBase}/documents/dealer-history/frequent-locations`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener ubicaciones frecuentes de repartidores');
  }

  return await response.json();
};

export const getNonOrderNavigationEvents = async (): Promise<ClientNavigationDocument[]> => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.apiBase}/documents/user-navigation/non-order-actions`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener acciones de navegación');
  }

  return await response.json();
};



export const getReviewStatsByHour = async (): Promise<ReviewHourStats[]> => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.apiBase}/documents/customer-review/hourly-stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener estadísticas por hora');
  }

  return await response.json();
};