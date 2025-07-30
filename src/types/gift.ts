export interface GiftFormData {
  gender: 'male' | 'female';
  age: number;
  personality: string;
  occasionType: string;
  minBudget: number;
  maxBudget: number;
  category?: string;
  additionalInfo?: string;
}

export interface GiftRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  coupangUrl: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

export interface GPTResponse {
  recommendations: GiftRecommendation[];
  success: boolean;
  error?: string;
} 