export interface Client {
  id: number;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  ubication: string
}

declare module 'geojson' {
  interface LineString {
    type: 'LineString';
    coordinates: number[][]; // [longitud, latitud][]
  }
}

export interface Order {
  id: number
  address: string
  orderDate: string
  deliveryDate: string
  status: string
  products: number
  clientId: number
  nameClient: string
  dealerId: number
  dealerName: string
  totalPrice: number
  totalProducts: number
  estimatedRoute: string | null; // Ruta estimada (equivalente a estimated_route)
}

export interface Dealer {
  id: number | null;
  name: string;
  rut: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: string;
  avgWaitTime: string;
  deliveryCount: number;
  ubication: string;
}

export interface Company {
  id: number
  name: string
  phone: string
  email: string
  type: string
}

export type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  category: string;
  companyId: number;
}


export interface OrderDetails {
  id: number
  orderId: number
  totalProducts: number
  price: number
  paymentMethod: string
}

export interface PaymentMethod {
  id: number
  type: string
}

export interface TopSpender{
  id: number
  name: string
  rut: string
  email: string
  phone: string
  address: string
  totalSpent: number

}

export interface OrderTotalProductsDTO{
  id: number
     orderDate: string;
     deliveryDate: string;
     status: string;
     totalPrice: number;
    totalProducts: number;

}


export interface OrderNameAddressDTO {
   id: number;
      orderDate: string;
      deliveryDate: string;
      status: string;
      totalPrice: number;
      clientId: number;
      nameClient: string // Nombre del cliente
      address: string // Dirección del cliente
}

export interface NearestDeliveryPointDTO {
  clientId: number;
  clientName: string;
  clientAddress: string;
  clientLocation: string; // WKT del punto
  companyName: string;
  distanceMeters: number;
}

export type EmergencyReport = {
  id: number;
  orderId: number;
  dealerId: number;
  ubication: string; // WKT
};

export interface CoverageArea {
  coverageId: number;
  name: string;
  coverageArea: string; // WKT del polígono (ej: "POLYGON((...))")
}

export interface CoverageCheckDTO {
  clientId: number;
  clientName: string;
  companyId: number;
  companyName: string;
  coverageId: number | null;  // Nullable
  coverageName: string | null; // Nullable
  isCovered: boolean;
  distanceMeters: number;
}

export interface DealerWithDistanceDTO {
  id: number;
  distanceMeters: number;
}

export interface DealerWithDistance extends Dealer {
  distanceMeters: number;
  distanceFormatted: string;
}

export type UserNavigationEvent = 
  | 'view_products'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'checkout_start'
  | 'checkout_complete'


export interface UserNavigationDocument {
  clientId: number
  eventType: UserNavigationEvent
  metadata?: Record<string, any>
  timestamp: string
}

export type CartTrackingEvent =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'cart_cleared'
  | 'cart_restored'
  | 'view_cart'
  | 'checkout_started'

export interface CartTrackingData {
  productId?: number
  productName?: string
  currentCartSize: number
  itemsCleared?: number
  lastProduct?: { id: number; name: string }
}

export interface AverageRatingWithNameProjection {
  _id: string;
  companyId: string;
  companyName: string;
  averageRating: number;
}

export interface CustomerReviewDocument {
  id: string;
  reviewId: number;
  comment: string;
  rating: number;
  date: string; // o Date si planeas transformarlo directamente
  clientId: number;
  companyId: number;
}

export interface RapidChangeOrderDTO {
  orderId: number;
  changeCount: number;
  firstChange: string; // o Date si haces el parse
  lastChange: string;
}

export interface DealerFrequentLocation {
  dealerId: number;
  location: number[]; // [longitude, latitude]
  count: number;
}

export interface ClientNavigationDocument {
  id: string;
  clientId: number;
  eventType: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ReviewHourStats {
  _id: number;       // hora del día (0 a 23)
  count: number;
  avgRating: number;
}

export interface CustomerReview {
  reviewId?: number;
  comment: string;
  rating: number;
  date?: string;
  clientId: number;
  companyId: number;
}



// Tipo para la respuesta de calificación
export interface CompanyRatingResponse {
  id: string
  reviewId: number
  companyId: number
  companyName: string
  rating: number
  comment: string
  date: string
  clientName: string
}

// Tipo para estadísticas de calificación
export interface CompanyRatingStats {
  companyId: number
  companyName: string
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

// Tipo para el resumen de calificaciones de un cliente
export interface ClientRatingSummary {
  clientId: number
  totalRatingsGiven: number
  averageRatingGiven: number
  lastRatingDate?: string
}

// Tipo para la vista previa de calificación
export interface RatingPreview {
  companyId: number
  companyName: string
  companyType: string
  canRate: boolean
  lastRating?: {
    rating: number
    date: string
  }
}

// Tipo para el componente de selección de estrellas
export interface StarRatingSelection {
  value: number
  label: string
  icon: string
  color: string
}

// Tipo para el payload de búsqueda de calificaciones
export interface RatingSearchCriteria {
  companyId?: number
  clientId?: number
  minRating?: number
  maxRating?: number
  startDate?: string
  endDate?: string
  containsText?: string
}

// Tipo para la respuesta paginada de calificaciones
export interface PaginatedRatings {
  items: CompanyRatingResponse[]
  total: number
  page: number
  pageSize: number
}


export interface CompanyRatingRequest {
  companyId: number
  rating: number
  comment: string
  clientId: number
}

export interface CompanyRatingResponse {
  id: string
  reviewId: number
  companyId: number
  rating: number
  comment: string
  date: string
}

export interface PaginatedRatings {
  items: CompanyRatingResponse[]
  total: number
  page: number
  pageSize: number
}

export interface RatingStats {
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}