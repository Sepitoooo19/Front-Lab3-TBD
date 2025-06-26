<script setup lang="ts">
import { submitCompanyRating } from '~/services/customerReviewService'

const props = defineProps<{
  companyId: number
}>()

const emit = defineEmits(['submitted'])

const rating = ref(0)
const comment = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  if (!rating.value) {
    error.value = 'Por favor selecciona una calificación'
    return
  }

  try {
    isLoading.value = true
    error.value = null
    
    await submitCompanyRating({
      companyId: props.companyId,
      rating: rating.value,
      comment: comment.value,
      clientId: Number(localStorage.getItem('userId')) // Asume que guardas el ID del usuario
    })
    
    emit('submitted')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="rating-form space-y-4">
    <div>
      <label class="block mb-2 font-medium">Calificación:</label>
      <div class="flex space-x-2">
        <button
          v-for="star in 5"
          :key="star"
          @click="rating = star"
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="{
            'bg-yellow-400 text-white': star <= rating,
            'bg-gray-200 text-gray-700': star > rating
          }"
        >
          {{ star }}
        </button>
      </div>
    </div>

    <div>
      <label class="block mb-2 font-medium">Comentario (opcional):</label>
      <textarea
        v-model="comment"
        class="w-full p-2 border rounded"
        rows="3"
        placeholder="Tu experiencia con esta empresa..."
      ></textarea>
    </div>

    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>

    <button
      @click="submit"
      :disabled="isLoading || !rating"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {{ isLoading ? 'Enviando...' : 'Enviar Calificación' }}
    </button>
  </div>
</template>