import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Store {
  id: number;
  name: string;
  category: string;
  views: number;
  viewPercentage: number;
  status: 'active' | 'pending' | 'inactive';
  description?: string;
  createdAt?: string;
  image?: string;
  products?: Product[];
  sales?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Añadimos FormsModule para usar ngModel
})
export class AdminComponent implements OnInit {
  // Estadísticas generales
  stats = {
    totalStores: 245,
    activeStores: 198,
    totalViews: 1456789,
    totalUsers: 5243,
    revenue: 345678
  };

  // Variables para gráficos y filtros
  selectedPeriod: 'week' | 'month' | 'year' = 'month';
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedStore: Store | null = null;

  // Datos de las tiendas
  stores: Store[] = [
    {
      id: 1,
      name: "Electrónica Premium",
      category: "Electrónica",
      views: 45678,
      viewPercentage: 25,
      status: 'active',
      description: "Tienda especializada en productos electrónicos de alta gama.",
      createdAt: "15/03/2023",
      image: "/assets/images/stores/electronics.jpg",
      products: [
        {
          id: 101,
          name: "Smartphone X-12",
          description: "Último modelo con 256GB de almacenamiento",
          price: 899,
          stock: 45,
          sales: 120,
          image: "/assets/images/products/phone.jpg"
        },
        {
          id: 102,
          name: "Laptop UltraSlim",
          description: "Procesador i9, 32GB RAM, 1TB SSD",
          price: 1299,
          stock: 23,
          sales: 67,
          image: "/assets/images/products/laptop.jpg"
        }
      ],
      sales: 187
    },
    {
      id: 2,
      name: "Moda Actual",
      category: "Ropa",
      views: 32456,
      viewPercentage: 18,
      status: 'active',
      description: "Lo último en tendencias de moda para todos los estilos.",
      createdAt: "22/05/2023",
      image: "/assets/images/stores/fashion.jpg",
      products: [
        {
          id: 201,
          name: "Chaqueta de Cuero",
          description: "Chaqueta negra con detalles metálicos",
          price: 129,
          stock: 34,
          sales: 89,
          image: "/assets/images/products/jacket.jpg"
        }
      ],
      sales: 89
    },
    {
      id: 3,
      name: "Hogar & Decoración",
      category: "Hogar",
      views: 28976,
      viewPercentage: 16,
      status: 'pending',
      description: "Todo para decorar tu hogar con estilo y confort.",
      createdAt: "08/07/2023",
      image: "/assets/images/stores/home.jpg",
      products: [],
      sales: 0
    },
    {
      id: 4,
      name: "Deportes Extremos",
      category: "Deportes",
      views: 19543,
      viewPercentage: 11,
      status: 'inactive',
      description: "Equipamiento para deportes de aventura y exterior.",
      createdAt: "14/02/2023",
      image: "/assets/images/stores/sports.jpg",
      products: [],
      sales: 0
    }
  ];

  // Tiendas principales para la gráfica
  topStores: Store[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Simulamos carga de datos
    setTimeout(() => {
      this.topStores = [...this.stores].sort((a, b) => b.views - a.views).slice(0, 5);
      this.isLoading = false;
    }, 1000);
  }

  getFilteredStores(): Store[] {
    if (!this.searchTerm) return this.stores;

    return this.stores.filter(store =>
      store.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      store.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getBarHeight(percentage: number): string {
    return `${percentage * 2}px`;
  }

  changePeriod(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    this.loadData();
  }

  editStore(store: Store): void {
    console.log('Editar tienda:', store);
    // Aquí iría la lógica para editar la tienda
  }

  viewStoreDetails(store: Store): void {
    this.selectedStore = store;
  }

  closeStoreDetails(): void {
    this.selectedStore = null;
  }

  toggleStoreStatus(store: Store): void {
    if (store.status === 'active') {
      store.status = 'inactive';
    } else {
      store.status = 'active';
    }
  }
}
