export type Gender = 'Hombre' | 'Mujer' | 'Unisex';

export type OlfactoryFamily =
  | 'Amaderada'
  | 'Oriental / Ámbar'
  | 'Floral'
  | 'Cítrica / Fresca'
  | 'Gourmand / Especiada'
  | 'Cuero / Chipre';

export type Concentration =
  | 'Extrait de Parfum'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Eau de Toilette';

export interface PerfumeSize {
  ml: number;
  priceDOP: number;
  inStock: boolean;
}

export interface Perfume {
  id: string;
  name: string;
  house: string;
  gender: Gender;
  category: 'Nicho' | 'Diseñador';
  family: OlfactoryFamily;
  concentration: Concentration;
  description: string;
  sizes: PerfumeSize[];
  selectedSizeIndex?: number;
  image: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string; // e.g. "12+ horas"
  sillage: 'Íntima' | 'Moderada' | 'Pronunciada' | 'Enorme';
  bestOccasion: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  batchCodeExample: string;
}

export interface CartItem {
  perfume: Perfume;
  sizeMl: number;
  priceDOP: number;
  quantity: number;
}

export interface FilterState {
  search: string;
  gender: 'Todos' | Gender;
  category: 'Todos' | 'Nicho' | 'Diseñador';
  family: 'Todos' | OlfactoryFamily;
  brand: 'Todas' | string;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  sector: string;
  address: string;
  deliveryType: 'express-sd' | 'nacional';
  paymentMethod: 'contra-entrega' | 'transferencia' | 'tarjeta' | 'whatsapp';
  notes?: string;
}
