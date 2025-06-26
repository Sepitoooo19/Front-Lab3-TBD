import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

/**
 * Servicio para manejar la migración de datos de PostgreSQL a MongoDB
 */
export const MigrationService = {
  /**
   * Migrar clientes a MongoDB
   */
  migrateClients: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/clients`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando clientes')
  },

  /**
   * Migrar dealers a MongoDB
   */
  migrateDealers: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/dealers`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando dealers')
  },

  /**
   * Migrar empresas a MongoDB
   */
  migrateCompanies: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/companies`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando empresas')
  },

  /**
   * Migrar áreas de cobertura a MongoDB
   */
  migrateCoverageAreas: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/coverage-areas`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando áreas de cobertura')
  },

  /**
   * Migrar reportes de emergencia a MongoDB
   */
  migrateEmergencyReports: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/emergency-reports`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando reportes de emergencia')
  },

  /**
   * Migrar detalles de pedidos a MongoDB
   */
  migrateOrderDetails: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/order-details`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando detalles de pedidos')
  },

  /**
   * Migrar pedidos a MongoDB
   */
  migrateOrders: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/order`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando pedidos')
  },

  /**
   * Migrar métodos de pago a MongoDB
   */
  migratePaymentMethods: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/payment-methods`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando métodos de pago')
  },

  /**
   * Migrar productos a MongoDB
   */
  migrateProducts: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/products`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando productos')
  },

  /**
   * Migrar calificaciones a MongoDB
   */
  migrateRatings: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/ratings`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando calificaciones')
  },

  /**
   * Migrar usuarios a MongoDB
   */
  migrateUsers: async (): Promise<void> => {
    const response = await fetch(`${config.public.apiBase}/migration/users`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Error migrando usuarios')
  },
}