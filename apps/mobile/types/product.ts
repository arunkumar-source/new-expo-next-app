export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}
