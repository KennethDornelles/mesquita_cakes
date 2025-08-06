import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  categoryId: number;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  allergens: string[];
  weight: string;
  serves: number;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private categories: Category[] = [
    { id: 1, name: 'Bolos', slug: 'bolos', description: 'Bolos tradicionais e especiais' },
    { id: 2, name: 'Tortas', slug: 'tortas', description: 'Tortas doces e salgadas' },
    { id: 3, name: 'Doces', slug: 'doces', description: 'Docinhos e brigadeiros' },
    { id: 4, name: 'Salgados', slug: 'salgados', description: 'Salgados variados' },
    { id: 5, name: 'Bebidas', slug: 'bebidas', description: 'Bebidas e sucos' }
  ];

  private products: Product[] = [
    {
      id: 1,
      name: 'Bolo de Chocolate Premium',
      slug: 'bolo-chocolate-premium',
      description: 'Delicioso bolo de chocolate com cobertura cremosa e recheio de brigadeiro.',
      price: 45.00,
      image: '/assets/images/bolo-chocolate.jpg',
      images: [
        '/assets/images/bolo-chocolate.jpg',
        '/assets/images/bolo-chocolate-2.jpg',
        '/assets/images/bolo-chocolate-3.jpg'
      ],
      categoryId: 1,
      category: 'Bolos',
      rating: 4.8,
      reviewCount: 125,
      inStock: true,
      featured: true,
      ingredients: ['Chocolate 70%', 'Farinha de trigo', 'Ovos', 'Açúcar', 'Manteiga', 'Leite', 'Fermento'],
      nutritionalInfo: {
        calories: 320,
        carbs: 45,
        protein: 6,
        fat: 14,
        fiber: 3,
        sugar: 28
      },
      allergens: ['Glúten', 'Lactose', 'Ovos'],
      weight: '1kg',
      serves: 8
    },
    {
      id: 2,
      name: 'Torta de Morango',
      slug: 'torta-morango',
      description: 'Torta fresca com morangos selecionados e chantilly artesanal.',
      price: 52.00,
      image: '/assets/images/torta-morango.jpg',
      images: [
        '/assets/images/torta-morango.jpg',
        '/assets/images/torta-morango-2.jpg'
      ],
      categoryId: 2,
      category: 'Tortas',
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      featured: true,
      ingredients: ['Morangos frescos', 'Chantilly', 'Biscoito champagne', 'Gelatina', 'Açúcar'],
      nutritionalInfo: {
        calories: 280,
        carbs: 35,
        protein: 4,
        fat: 12,
        fiber: 2,
        sugar: 25
      },
      allergens: ['Glúten', 'Lactose'],
      weight: '1.2kg',
      serves: 10
    },
    {
      id: 3,
      name: 'Brigadeiros Gourmet',
      slug: 'brigadeiros-gourmet',
      description: 'Caixa com 12 brigadeiros gourmet de sabores variados.',
      price: 18.00,
      image: '/assets/images/brigadeiros.jpg',
      images: [
        '/assets/images/brigadeiros.jpg',
        '/assets/images/brigadeiros-2.jpg'
      ],
      categoryId: 3,
      category: 'Doces',
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      featured: false,
      ingredients: ['Chocolate belga', 'Leite condensado', 'Manteiga', 'Granulados especiais'],
      nutritionalInfo: {
        calories: 95,
        carbs: 12,
        protein: 2,
        fat: 5,
        fiber: 1,
        sugar: 10
      },
      allergens: ['Lactose'],
      weight: '240g',
      serves: 12
    },
    {
      id: 4,
      name: 'Bolo Red Velvet',
      slug: 'bolo-red-velvet',
      description: 'Clássico bolo red velvet com cream cheese e decoração elegante.',
      price: 48.00,
      image: '/assets/images/red-velvet.jpg',
      images: [
        '/assets/images/red-velvet.jpg',
        '/assets/images/red-velvet-2.jpg'
      ],
      categoryId: 1,
      category: 'Bolos',
      rating: 4.6,
      reviewCount: 67,
      inStock: true,
      featured: true,
      ingredients: ['Farinha de trigo', 'Cacau', 'Corante natural', 'Cream cheese', 'Ovos', 'Açúcar'],
      nutritionalInfo: {
        calories: 340,
        carbs: 42,
        protein: 5,
        fat: 16,
        fiber: 2,
        sugar: 30
      },
      allergens: ['Glúten', 'Lactose', 'Ovos'],
      weight: '1kg',
      serves: 8
    },
    {
      id: 5,
      name: 'Coxinha de Frango',
      slug: 'coxinha-frango',
      description: 'Coxinha tradicional com recheio cremoso de frango desfiado.',
      price: 4.50,
      image: '/assets/images/coxinha.jpg',
      images: [
        '/assets/images/coxinha.jpg'
      ],
      categoryId: 4,
      category: 'Salgados',
      rating: 4.5,
      reviewCount: 156,
      inStock: true,
      featured: false,
      ingredients: ['Frango desfiado', 'Massa de batata', 'Temperos', 'Farinha de rosca'],
      nutritionalInfo: {
        calories: 180,
        carbs: 22,
        protein: 12,
        fat: 6,
        fiber: 1,
        sugar: 2
      },
      allergens: ['Glúten'],
      weight: '80g',
      serves: 1
    },
    {
      id: 6,
      name: 'Torta de Limão',
      slug: 'torta-limao',
      description: 'Torta de limão com merengue dourado e base crocante.',
      price: 38.00,
      image: '/assets/images/torta-limao.jpg',
      images: [
        '/assets/images/torta-limao.jpg',
        '/assets/images/torta-limao-2.jpg'
      ],
      categoryId: 2,
      category: 'Tortas',
      rating: 4.4,
      reviewCount: 92,
      inStock: true,
      featured: false,
      ingredients: ['Limão siciliano', 'Ovos', 'Açúcar', 'Manteiga', 'Farinha de trigo'],
      nutritionalInfo: {
        calories: 290,
        carbs: 38,
        protein: 5,
        fat: 13,
        fiber: 1,
        sugar: 28
      },
      allergens: ['Glúten', 'Lactose', 'Ovos'],
      weight: '900g',
      serves: 8
    },
    {
      id: 7,
      name: 'Cupcakes Sortidos',
      slug: 'cupcakes-sortidos',
      description: 'Kit com 6 cupcakes de sabores variados e decoração especial.',
      price: 24.00,
      image: '/assets/images/cupcakes.jpg',
      images: [
        '/assets/images/cupcakes.jpg',
        '/assets/images/cupcakes-2.jpg'
      ],
      categoryId: 1,
      category: 'Bolos',
      rating: 4.7,
      reviewCount: 134,
      inStock: true,
      featured: false,
      ingredients: ['Farinha de trigo', 'Açúcar', 'Ovos', 'Manteiga', 'Essências naturais', 'Decorações'],
      nutritionalInfo: {
        calories: 220,
        carbs: 32,
        protein: 4,
        fat: 9,
        fiber: 1,
        sugar: 24
      },
      allergens: ['Glúten', 'Lactose', 'Ovos'],
      weight: '480g',
      serves: 6
    },
    {
      id: 8,
      name: 'Suco Natural de Laranja',
      slug: 'suco-laranja',
      description: 'Suco natural de laranja sem conservantes, 500ml.',
      price: 8.00,
      image: '/assets/images/suco-laranja.jpg',
      images: [
        '/assets/images/suco-laranja.jpg'
      ],
      categoryId: 5,
      category: 'Bebidas',
      rating: 4.3,
      reviewCount: 78,
      inStock: true,
      featured: false,
      ingredients: ['Laranja natural', 'Água'],
      nutritionalInfo: {
        calories: 110,
        carbs: 26,
        protein: 2,
        fat: 0,
        fiber: 0,
        sugar: 22
      },
      allergens: [],
      weight: '500ml',
      serves: 2
    },
    {
      id: 9,
      name: 'Pão de Açúcar',
      slug: 'pao-acucar',
      description: 'Doce tradicional em formato de pão de açúcar, sabor coco.',
      price: 12.00,
      image: '/assets/images/pao-acucar.jpg',
      images: [
        '/assets/images/pao-acucar.jpg'
      ],
      categoryId: 3,
      category: 'Doces',
      rating: 4.2,
      reviewCount: 45,
      inStock: true,
      featured: false,
      ingredients: ['Coco ralado', 'Açúcar', 'Leite condensado', 'Ovos'],
      nutritionalInfo: {
        calories: 150,
        carbs: 28,
        protein: 3,
        fat: 4,
        fiber: 2,
        sugar: 25
      },
      allergens: ['Lactose', 'Ovos'],
      weight: '100g',
      serves: 2
    },
    {
      id: 10,
      name: 'Empada de Palmito',
      slug: 'empada-palmito',
      description: 'Empada artesanal com recheio cremoso de palmito.',
      price: 5.50,
      image: '/assets/images/empada.jpg',
      images: [
        '/assets/images/empada.jpg'
      ],
      categoryId: 4,
      category: 'Salgados',
      rating: 4.6,
      reviewCount: 87,
      inStock: true,
      featured: false,
      ingredients: ['Palmito', 'Massa folhada', 'Temperos', 'Ovos', 'Leite'],
      nutritionalInfo: {
        calories: 195,
        carbs: 18,
        protein: 6,
        fat: 11,
        fiber: 2,
        sugar: 1
      },
      allergens: ['Glúten', 'Lactose', 'Ovos'],
      weight: '90g',
      serves: 1
    }
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let filteredProducts = [...this.products];

    if (filters) {
      // Filter by category
      if (filters.categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
      }

      // Filter by price range
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
      }

      // Sort products
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];

          if (filters.sortBy === 'name') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          } else {
            return aValue > bValue ? 1 : -1;
          }
        });
      }
    }

    return of(filteredProducts);
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.slug === slug);
    return of(product);
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products.filter(p => p.featured);
    return of(featured);
  }

  getPopularProducts(): Observable<Product[]> {
    const popular = this.products.filter(p => p.rating >= 4.5).slice(0, 6);
    return of(popular);
  }

  getRelatedProducts(categoryId: number, excludeId: number): Observable<Product[]> {
    const related = this.products
      .filter(p => p.categoryId === categoryId && p.id !== excludeId)
      .slice(0, 4);
    return of(related);
  }

  searchProducts(term: string): Observable<Product[]> {
    const searchTerm = term.toLowerCase();
    const results = this.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
    return of(results);
  }
}