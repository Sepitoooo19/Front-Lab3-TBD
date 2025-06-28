<script setup lang="ts">
import { getAllCompanies } from '~/services/companyService'

const props = defineProps<{
  modelValue: number | null
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const companies = ref<Array<{id: number, name: string}>>([])
const isLoading = ref(false)

const fetchCompanies = async () => {
  try {
    isLoading.value = true
    const data = await getAllCompanies()
    companies.value = data.map(company => ({
      id: company.id,
      name: company.name
    }))
  } catch (error) {
    console.error("Error cargando empresas:", error)
    alert("Error al cargar empresas")
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCompanies()
})
</script>

<template>
  <div class="company-selector">
    <label class="block mb-2 font-medium">Seleccionar empresa:</label>
    <select
      :value="modelValue"
      @change="emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))"
      class="w-full p-2 border rounded"
      :disabled="isLoading || props.disabled"
    >
      <option :value="null" :disabled="isLoading || props.disabled">Seleccione una empresa</option>
      <option 
        v-for="company in companies" 
        :key="company.id" 
        :value="company.id"
      >
        {{ company.name }}
      </option>
    </select>
    <p v-if="isLoading" class="text-sm text-gray-500 mt-1">Cargando empresas...</p>
  </div>
</template>