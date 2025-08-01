export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  planet: string;
  breakdown: Record<string, string>;
  isExclusive: number;
}

export interface CartItem {
  id: string;
  productId: string;
  sessionId: string;
  product: Product;
}

export interface SearchResult {
  item: string;
  planet: string;
  agency: string;
  price: string;
  breakdown: Record<string, string>;
  isSun?: boolean;
  message?: string;
}

export interface ComparisonResult {
  item: string;
  prices: Record<string, string>;
}
