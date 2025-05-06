import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-cliente",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.css"],
})
export class ClienteComponent {
  restaurants: any[] = []
  categories: any[] = []
  activeOrders: any[] = []
  orderHistory: any[] = []
  cart: any[] = []
  selectedRestaurant: any = null
  selectedCategory = "all"
  searchTerm = ""
  isLoading = false
  showCart = false

  constructor() {}

  viewRestaurant(restaurant: any): void {
    this.selectedRestaurant = restaurant
    window.scrollTo(0, 0)
  }

  backToRestaurants(): void {
    this.selectedRestaurant = null
  }

  addToCart(item: any): void {
    const existingItem = this.cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cart.push({
        ...item,
        quantity: 1,
        restaurantId: this.selectedRestaurant.id,
        restaurantName: this.selectedRestaurant.name,
      })
    }

    this.showCart = true
  }

  removeFromCart(itemId: number): void {
    const index = this.cart.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1
      } else {
        this.cart.splice(index, 1)
      }
    }
  }

  clearCart(): void {
    this.cart = []
  }

  checkout(): void {
    // En un caso real, aquí se enviaría la información al backend
    alert("¡Pedido realizado con éxito!")
    this.cart = []
    this.showCart = false
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  getFilteredRestaurants() {
    let filtered = this.restaurants

    if (this.selectedCategory !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.categories.includes(this.selectedCategory))
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter((restaurant) => restaurant.name.toLowerCase().includes(term))
    }

    return filtered
  }

  getCategoryName(catId: string): string {
    const category = this.categories.find((c) => c.id === catId)
    return category ? category.name : ""
  }
}
