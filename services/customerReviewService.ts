import { useRuntimeConfig } from '#imports'
import type {
  CompanyRatingRequest,
  CompanyRatingResponse,
  PaginatedRatings,
  RatingStats
} from '~/types/types'

const config = useRuntimeConfig()

export const submitCompanyRating = async (
  request: CompanyRatingRequest
): Promise<CompanyRatingResponse> => {
  const token = localStorage.getItem('jwt')
  
  const response = await fetch(`${config.public.apiBase}/documents/customer-review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...request,
      date: new Date().toISOString()
    })
  })

  if (!response.ok) throw new Error('Error al enviar la calificación')
  return await response.json()
}

export const getCompanyRatings = async (
  companyId: number
): Promise<PaginatedRatings> => {
  const response = await fetch(`${config.public.apiBase}/documents/customer-review/company/${companyId}`)
  if (!response.ok) throw new Error('Error al obtener calificaciones')
  return await response.json()
}

export const getCompanyRatingStats = async (
  companyId: number
): Promise<RatingStats> => {
  const response = await fetch(`${config.public.apiBase}/documents/customer-review/company/${companyId}/stats`)
  if (!response.ok) throw new Error('Error al obtener estadísticas')
  return await response.json()
}