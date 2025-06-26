<script setup lang="ts">
import { MigrationService } from '~/services/migrationService'

const migrationStatus = ref<Record<string, string>>({})
const isLoading = ref<Record<string, boolean>>({})
const globalLoading = ref(false)

const migrateEntity = async (entity: string, migrationFn: () => Promise<void>) => {
  try {
    isLoading.value[entity] = true
    await migrationFn()
    migrationStatus.value[entity] = '✅ Migración exitosa'
  } catch (error) {
    migrationStatus.value[entity] = `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
  } finally {
    isLoading.value[entity] = false
  }
}

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-2xl font-bold mb-6">Migración de Datos</h1>
    <p class="mb-8 text-gray-600">
      Esta herramienta permite migrar datos desde PostgreSQL a MongoDB.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div 
        v-for="(item, index) in [
          {entity: 'Clientes', fn: () => MigrationService.migrateClients()},
          {entity: 'Dealers', fn: () => MigrationService.migrateDealers()},
          {entity: 'Empresas', fn: () => MigrationService.migrateCompanies()},
          {entity: 'Áreas de Cobertura', fn: () => MigrationService.migrateCoverageAreas()},
          {entity: 'Reportes de Emergencia', fn: () => MigrationService.migrateEmergencyReports()},
          {entity: 'Detalles de Pedidos', fn: () => MigrationService.migrateOrderDetails()},
          {entity: 'Pedidos', fn: () => MigrationService.migrateOrders()},
          {entity: 'Métodos de Pago', fn: () => MigrationService.migratePaymentMethods()},
          {entity: 'Productos', fn: () => MigrationService.migrateProducts()},
          {entity: 'Calificaciones', fn: () => MigrationService.migrateRatings()},
          {entity: 'Usuarios', fn: () => MigrationService.migrateUsers()}
        ]" 
        :key="index"
        class="border rounded-lg p-4 bg-white shadow-sm"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium">Migrar datos de {{ item.entity }} a Mongo</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ migrationStatus[item.entity.toLowerCase().replace(/\s+/g, '-')] || 'No migrado aún' }}
            </p>
          </div>
          <button
            @click="migrateEntity(item.entity.toLowerCase().replace(/\s+/g, '-'), item.fn)"
            :disabled="isLoading[item.entity.toLowerCase().replace(/\s+/g, '-')]"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isLoading[item.entity.toLowerCase().replace(/\s+/g, '-')] ? 'Migrando...' : 'Migrar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>