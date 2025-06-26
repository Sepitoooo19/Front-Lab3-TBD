<script setup lang="ts">
const selectedCompanyId = ref<number | null>(null)
const isSubmitted = ref(false)

const handleSubmission = () => {
  isSubmitted.value = true
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-6">Calificar Empresa</h1>
    
    <div v-if="!isSubmitted">
      <CompanySelector v-model="selectedCompanyId" />
      
      <div v-if="selectedCompanyId" class="mt-8">
        <RatingForm 
          :company-id="selectedCompanyId" 
          @submitted="handleSubmission"
        />
      </div>
      
      <div v-else-if="selectedCompanyId === null" class="mt-4 text-gray-500">
        Por favor selecciona una empresa para calificar
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <div class="text-green-500 text-5xl mb-4">✓</div>
      <h2 class="text-xl font-semibold mb-2">¡Calificación enviada!</h2>
      <p class="mb-4">Gracias por tu opinión.</p>
      <button
        @click="$router.push('/client-orders')"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver a mis pedidos
      </button>
    </div>
  </div>
</template>