<script setup lang="ts">
definePageMeta({
  layout: 'client'
})

import { useRoute, useRouter } from 'vue-router'
import { getCompanyById } from '~/services/companyService'
import type { Company } from '~/types/types'

const route = useRoute()
const router = useRouter()
const selectedCompanyId = ref<number | null>(null)
const companyName = ref<string | null>(null)
const isSubmitted = ref(false)
const isLoading = ref(false)
const companyIdParam = ref<string | null>(null)

// Obtener el companyId de los parámetros de la URL
onMounted(async () => {
  const companyIdParam = route.query.companyId as string
  if (companyIdParam) {
    selectedCompanyId.value = parseInt(companyIdParam as string)
    if (selectedCompanyId.value) {
      try {
        isLoading.value = true
        const company = await getCompanyById(selectedCompanyId.value.toString())
        companyName.value = company.name
      } catch (error) {
        console.error('Error al obtener la empresa:', error)
        // Redirigir a client-orders si hay error
        router.push('/client-orders')
      } finally {
        isLoading.value = false
      }
    }
  }
})

const handleSubmission = () => {
  isSubmitted.value = true
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-6">Calificar Empresa</h1>
    
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
      <p class="mt-4">Cargando información de la empresa...</p>
    </div>

    <div v-else-if="!isSubmitted && !selectedCompanyId">
      <CompanySelector 
        v-model="selectedCompanyId" 
        :disabled="!!companyIdParam"
      />
    </div>

    <div v-else-if="!isSubmitted && selectedCompanyId">
      <div class="mb-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Calificando a: {{ companyName }}</h2>
          <p class="text-gray-600">ID de la empresa: {{ selectedCompanyId }}</p>
        </div>
      </div>
      
      <RatingForm 
        :company-id="selectedCompanyId" 
        @submitted="handleSubmission"
      />
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
</template>