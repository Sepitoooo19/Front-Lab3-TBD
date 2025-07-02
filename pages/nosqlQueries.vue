<!-- pages/analytics/company-ratings.vue -->
<script setup lang="ts">
// Importaciones necesarias
import { ref } from 'vue';
import { getAverageRatingWithCompanyName, searchCustomerReviewsByKeywords, getOrdersWithRapidChanges, getDealerFrequentLocations, getNonOrderNavigationEvents, getReviewStatsByHour} from '~/services/noSqlService';
import type { AverageRatingWithNameProjection, CustomerReviewDocument, RapidChangeOrderDTO, DealerFrequentLocation, ClientNavigationDocument, ReviewHourStats    } from '~/types/types';

// Datos reactivos
const averageRatings = ref<AverageRatingWithNameProjection[]>([]);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const keywordInput = ref('');
const keywordResults = ref<CustomerReviewDocument[]>([]);
const loadingKeywords = ref(false);
const keywordError = ref<string | null>(null);

const rapidChangeOrders = ref<RapidChangeOrderDTO[]>([]);
const loadingRapidChanges = ref(false);
const rapidChangesError = ref<string | null>(null);

const frequentLocations = ref<DealerFrequentLocation[]>([]);
const loadingFrequentLocations = ref(false);
const frequentLocationsError = ref<string | null>(null);

const nonOrderActions = ref<ClientNavigationDocument[]>([]);
const loadingNavigation = ref(false);
const navigationError = ref<string | null>(null);

const hourlyStats = ref<ReviewHourStats[]>([]);
const loadingHourlyStats = ref(false);
const hourlyStatsError = ref<string | null>(null);


// Función para obtener los promedios de puntuación
const fetchAverageRatings = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;
    averageRatings.value = await getAverageRatingWithCompanyName();
    console.log('Promedios de puntuación por empresa:', averageRatings.value);
  } catch (error) {
    console.error('Error al obtener los promedios:', error);
    errorMessage.value = 'Hubo un error al cargar los promedios de puntuación.';
  } finally {
    loading.value = false;
  }
};

const fetchReviewsByKeywords = async () => {
  if (!keywordInput.value.trim()) {
    keywordError.value = 'Ingresa al menos una palabra clave';
    keywordResults.value = [];
    return;
  }

  try {
    loadingKeywords.value = true;
    keywordError.value = null;
    const keywords = keywordInput.value.trim().split(/\s+/);
    keywordResults.value = await searchCustomerReviewsByKeywords(keywords);
  } catch (error) {
    console.error('Error al buscar opiniones por palabra clave:', error);
    keywordError.value = 'Hubo un error al buscar las opiniones.';
  } finally {
    loadingKeywords.value = false;
  }
};

const fetchRapidChangeOrders = async () => {
  try {
    loadingRapidChanges.value = true;
    rapidChangesError.value = null;
    rapidChangeOrders.value = await getOrdersWithRapidChanges();
  } catch (error) {
    console.error('Error al obtener cambios rápidos:', error);
    rapidChangesError.value = 'Hubo un error al cargar los pedidos con cambios rápidos.';
  } finally {
    loadingRapidChanges.value = false;
  }
};

const fetchFrequentLocations = async () => {
  try {
    loadingFrequentLocations.value = true;
    frequentLocationsError.value = null;
    frequentLocations.value = await getDealerFrequentLocations();
  } catch (error) {
    console.error('Error al obtener ubicaciones frecuentes:', error);
    frequentLocationsError.value = 'Hubo un error al cargar las ubicaciones frecuentes.';
  } finally {
    loadingFrequentLocations.value = false;
  }
};

const fetchNonOrderNavigationEvents = async () => {
  try {
    loadingNavigation.value = true;
    navigationError.value = null;
    nonOrderActions.value = await getNonOrderNavigationEvents();
  } catch (error) {
    console.error('Error al obtener navegación sin pedidos:', error);
    navigationError.value = 'Hubo un error al cargar las acciones de navegación.';
  } finally {
    loadingNavigation.value = false;
  }
};

const fetchReviewStatsByHour = async () => {
  try {
    loadingHourlyStats.value = true;
    hourlyStatsError.value = null;
    hourlyStats.value = await getReviewStatsByHour();
  } catch (error) {
    console.error('Error al obtener estadísticas horarias:', error);
    hourlyStatsError.value = 'Hubo un error al cargar los datos por hora.';
  } finally {
    loadingHourlyStats.value = false;
  }
};

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Promedio de Puntuación por Empresa</h1>

    <!-- Cuadro de resultados -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Resultados</h2>
      
      <div v-if="loading" class="text-center py-4">
        <p>Cargando datos...</p>
      </div>
      
      <div v-else-if="errorMessage" class="text-red-500 py-4">
        {{ errorMessage }}
      </div>
      
      <div v-else-if="averageRatings.length > 0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuación Promedio</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rating, index) in averageRatings" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ rating.companyName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    <span class="font-semibold">{{ rating.averageRating.toFixed(2) }}</span>
                    <span class="ml-1 text-yellow-500">
                      <template v-for="i in 5" :key="i">
                        <span v-if="i <= Math.round(rating.averageRating)">★</span>
                        <span v-else class="text-gray-300">★</span>
                      </template>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else class="text-gray-500 py-4">
        No hay datos disponibles. Presiona el botón para cargar los promedios.
      </div>
    </div>

    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      @click="fetchAverageRatings"
      :disabled="loading"
    >
      {{ loading ? 'Cargando...' : 'Obtener Promedios' }}
    </button>
        <!-- Bloque para búsqueda de opiniones por palabra clave -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
      <h2 class="text-xl font-bold mb-2">Buscar Opiniones por Palabra Clave</h2>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <input 
          v-model="keywordInput"
          type="text"
          placeholder="Ej: demora error"
          class="w-full sm:w-2/3 px-4 py-2 border rounded shadow-sm"
        />
        <button 
          @click="fetchReviewsByKeywords"
          :disabled="loadingKeywords"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {{ loadingKeywords ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>

      <div v-if="keywordError" class="text-red-500">{{ keywordError }}</div>

      <div v-if="loadingKeywords" class="text-gray-500">Buscando opiniones...</div>

      <div v-else-if="keywordResults.length > 0">
        <ul class="divide-y divide-gray-200">
          <li v-for="review in keywordResults" :key="review.reviewId" class="py-2">
            <p class="text-sm text-gray-800"><strong>Comentario:</strong> {{ review.comment }}</p>
            <p class="text-sm text-gray-500">
              <strong>Rating:</strong> {{ review.rating }} ★
              <span class="ml-4"><strong>Fecha:</strong> {{ new Date(review.date).toLocaleString() }}</span>
            </p>
          </li>
        </ul>
      </div>

      <div v-else-if="!loadingKeywords && keywordInput">
        <p class="text-gray-500 italic">No se encontraron opiniones con esas palabras clave.</p>
      </div>
    </div>
    <!-- Bloque para pedidos con más de 3 cambios en 10 min -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
      <h2 class="text-xl font-bold mb-2">Pedidos con Cambios Rápidos de Estado</h2>

      <button 
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mb-4"
        @click="fetchRapidChangeOrders"
        :disabled="loadingRapidChanges"
      >
        {{ loadingRapidChanges ? 'Cargando...' : 'Obtener Pedidos' }}
      </button>

      <div v-if="rapidChangesError" class="text-red-500">{{ rapidChangesError }}</div>

      <div v-if="loadingRapidChanges" class="text-gray-500">Cargando datos...</div>

      <div v-else-if="rapidChangeOrders.length > 0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Pedido</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cambios</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in rapidChangeOrders" :key="order.orderId">
              <td class="px-6 py-4 whitespace-nowrap">{{ order.orderId }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ order.changeCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ new Date(order.firstChange).toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ new Date(order.lastChange).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loadingRapidChanges">
        <p class="text-gray-500 italic">No se encontraron pedidos con cambios rápidos de estado.</p>
      </div>
    </div>
    <!-- Bloque para rutas más frecuentes de repartidores -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
      <h2 class="text-xl font-bold mb-2">Ubicaciones Frecuentes de Repartidores (últimos 7 días)</h2>

      <button 
        class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mb-4"
        @click="fetchFrequentLocations"
        :disabled="loadingFrequentLocations"
      >
        {{ loadingFrequentLocations ? 'Cargando...' : 'Obtener Ubicaciones' }}
      </button>

      <div v-if="frequentLocationsError" class="text-red-500">{{ frequentLocationsError }}</div>

      <div v-if="loadingFrequentLocations" class="text-gray-500">Cargando ubicaciones...</div>

      <div v-else-if="frequentLocations.length > 0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Repartidor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación (Lng, Lat)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(loc, index) in frequentLocations" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">{{ loc.dealerId }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                [{{ loc.location[0].toFixed(5) }}, {{ loc.location[1].toFixed(5) }}]
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ loc.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loadingFrequentLocations">
        <p class="text-gray-500 italic">No se encontraron ubicaciones frecuentes.</p>
      </div>
    </div>
    <!-- Bloque para acciones de navegación que no son de pedidos -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
      <h2 class="text-xl font-bold mb-2">Acciones de Navegación (Excluye Pedidos)</h2>

      <button 
        class="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 mb-4"
        @click="fetchNonOrderNavigationEvents"
        :disabled="loadingNavigation"
      >
        {{ loadingNavigation ? 'Cargando...' : 'Obtener Navegación' }}
      </button>

      <div v-if="navigationError" class="text-red-500">{{ navigationError }}</div>

      <div v-if="loadingNavigation" class="text-gray-500">Cargando datos...</div>

      <div v-else-if="nonOrderActions.length > 0" class="overflow-x-auto max-h-96 overflow-y-scroll">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase">Cliente</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase">Evento</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase">Metadata</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(event, index) in nonOrderActions" :key="index">
              <td class="px-4 py-2">{{ event.clientId }}</td>
              <td class="px-4 py-2">{{ event.eventType }}</td>
              <td class="px-4 py-2">{{ new Date(event.timestamp).toLocaleString() }}</td>
              <td class="px-4 py-2">
                <pre class="whitespace-pre-wrap break-all text-xs">{{ JSON.stringify(event.metadata, null, 2) }}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loadingNavigation">
        <p class="text-gray-500 italic">No se encontraron acciones de navegación excluyendo pedidos.</p>
      </div>
    </div>
    <!-- Bloque para estadísticas de satisfacción por hora -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-6">
      <h2 class="text-xl font-bold mb-2">Estadísticas de Opiniones por Hora</h2>

      <button 
        class="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 mb-4"
        @click="fetchReviewStatsByHour"
        :disabled="loadingHourlyStats"
      >
        {{ loadingHourlyStats ? 'Cargando...' : 'Obtener Estadísticas' }}
      </button>

      <div v-if="hourlyStatsError" class="text-red-500">{{ hourlyStatsError }}</div>

      <div v-if="loadingHourlyStats" class="text-gray-500">Cargando estadísticas...</div>

      <div v-else-if="hourlyStats.length > 0">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase">Hora</th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase">Cantidad de Opiniones</th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase">Promedio de Rating</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(stat, index) in hourlyStats" :key="index">
              <!-- Ajustar la hora a la zona horaria local -->
              <td class="px-6 py-2">
                {{ (stat._id) % 24 }}:00 - {{ ((stat._id ) % 24 + 1) % 24 }}:00
              </td>
              <td class="px-6 py-2">{{ stat.count }}</td>
              <td class="px-6 py-2">
                <span v-if="typeof stat.avgRating === 'number'">
                  {{ stat.avgRating.toFixed(2) }}
                </span>
                <span v-else class="text-gray-400 italic">N/A</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!loadingHourlyStats">
        <p class="text-gray-500 italic">No se encontraron datos.</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Estilo para las estrellas de rating */
.star-rating {
  unicode-bidi: bidi-override;
  color: #c5c5c5;
  font-size: 1.5rem;
  position: relative;
  margin: 0;
  padding: 0;
}

.star-rating .filled {
  color: #ffc107;
  padding: 0;
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
