<!-- pages/analytics/company-ratings.vue -->
<script setup lang="ts">
// Importaciones necesarias
import { ref } from 'vue';
import { getAverageRatingWithCompanyName } from '~/services/noSqlService';
import type { AverageRatingWithNameProjection } from '~/types/types';

// Datos reactivos
const averageRatings = ref<AverageRatingWithNameProjection[]>([]);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

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

    <!-- Opcional: Gráfico de visualización -->
    <div v-if="averageRatings.length > 0" class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4">
      <h2 class="text-xl font-bold mb-2">Visualización Gráfica</h2>
      <div class="h-64">
        <!-- Aquí podrías integrar un componente de gráfico -->
        <p class="text-gray-500 italic">(Gráfico de barras o estrellas podría ir aquí)</p>
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