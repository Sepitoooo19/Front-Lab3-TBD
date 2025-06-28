<!-- page para calificar al repartidor-->

<script setup lang="ts">
definePageMeta({
  layout: 'client'
})

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addRating } from '~/services/ratingService';
import { getDealerNameById } from '~/services/dealerService';

// Const reactivas
const router = useRouter();
const route = useRoute();

const dealerId = ref<number | null>(route.query.dealerId ? parseInt(route.query.dealerId as string) : null);
const orderId = ref<number | null>(route.query.orderId ? parseInt(route.query.orderId as string) : null);
const clientId = ref<number | null>(route.query.clientId ? parseInt(route.query.clientId as string) : null);
const dealerName = ref<string | null>(null); // Almacena el nombre del repartidor
const isSubmitted = ref(false);

// Verifica si los parámetros necesarios están presentes
if (!dealerId.value || !orderId.value || !clientId.value) {
  alert('Faltan datos para calificar al repartidor.');
  router.push('/client-orders'); // Redirige si faltan datos
}

const rating = ref<number | null>(null);
const comment = ref<string>('');
const errorMessage = ref<string | null>(null);

// Cargar el nombre del repartidor
// Método: getDealerNameById
// Entrada: dealerId (ID del repartidor)
// Salida: dealerName (nombre del repartidor)
// Esta función se ejecuta al montar el componente
onMounted(async () => {
  try {
    if (dealerId.value) {
      dealerName.value = await getDealerNameById(dealerId.value);
    }
  } catch (error) {
    console.error('Error al obtener el nombre del repartidor:', error);
    dealerName.value = 'Desconocido'; // Valor predeterminado en caso de error
  }
});

// Función para guardar la calificación
// Método: addRating
// Entrada: rating (calificación), comment (comentario), date (fecha), clientId (ID del cliente), dealerId (ID del repartidor), orderId (ID del pedido)
// Salida: Redirige a la lista de órdenes después de guardar
// Esta función se ejecuta al hacer clic en el botón "Guardar Calificación"
const submitRating = async () => {
  if (!rating.value || rating.value < 1 || rating.value > 5) {
    errorMessage.value = 'La calificación debe estar entre 1 y 5.';
    return;
  }

  try {
    errorMessage.value = null;
    await addRating({
      rating: rating.value,
      comment: comment.value,
      date: new Date().toISOString(),
      clientId: clientId.value!,
      dealerId: dealerId.value!,
      orderId: orderId.value!,
    });
    isSubmitted.value = true;
  } catch (error) {
    console.error('Error al guardar la calificación:', error);
    errorMessage.value = 'Hubo un error al guardar la calificación.';
  }
};
</script>

<!-- template donde se puede calificar al repartidor-->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Calificar Repartidor</h1>
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
      <p><strong>Repartidor:</strong> {{ dealerName || 'Cargando...' }}</p>
      <p><strong>ID del Pedido:</strong> {{ orderId }}</p>

      <div class="mt-4">
        <label class="block font-bold mb-2">Calificación:</label>
        <div class="flex justify-center space-x-2">
          <button
            v-for="star in 5"
            :key="star"
            @click="rating = star"
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="{
              'bg-yellow-400 text-white': rating === star,
              'bg-gray-200 text-gray-700 hover:bg-gray-300': rating !== star
            }"
          >
            {{ star }}
          </button>
        </div>
      </div>

      <div class="mt-4">
        <label for="comment" class="block font-bold mb-2">Comentario:</label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          class="border border-gray-300 rounded px-4 py-2 w-full"
        ></textarea>
      </div>

      <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>

      <div v-if="!isSubmitted">
        <button
          @click="submitRating"
          class="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        >
          Guardar Calificación
        </button>
      </div>
      
      <div v-else class="text-center py-8">
        <div class="text-green-500 text-5xl mb-4">✓</div>
        <h2 class="text-xl font-semibold mb-2">¡Calificación enviada!</h2>
        <p class="mb-4">Gracias por tu opinión.</p>
        <button
          @click="router.push('/client-orders')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a mis pedidos
        </button>
      </div>
    </div>
  </div>
</template>