// services/trackingService.ts
import { getAuthenticatedClientProfile } from '~/services/clientService';

/**
 * Función para registrar una acción de navegación del cliente
 * @param eventType Tipo de evento ('view_products', 'add_to_cart', etc.)
 * @param metadata Datos adicionales de la acción (opcional)
 * @returns Promise<void>
 */
export const trackClientNavigation = async ({
  eventType,
  metadata = {}
}: {
  eventType: string;
  metadata?: Record<string, any>;
}): Promise<void> => {
  const config = useRuntimeConfig();
  
  try {
    const client = await getAuthenticatedClientProfile();
    const response = await fetch(`${config.public.apiBase}/documents/user-navigation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: client.id,
        eventType,
        metadata,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Error al registrar el evento de navegación');
    }
  } catch (error) {
    console.error('Error en tracking (no crítico):', error);
    // No relanzamos el error para no interrumpir el flujo principal
  }
};