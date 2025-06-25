<!-- pages/analytics/company-ratings.vue -->
<script setup lang="ts">
// Importaciones necesarias
import { ref } from 'vue';
import { getAverageRatingWithCompanyName, searchCustomerReviewsByKeywords, getOrdersWithRapidChanges   } from '~/services/noSqlService';
import type { AverageRatingWithNameProjection, CustomerReviewDocument, RapidChangeOrderDTO  } from '~/types/types';

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
