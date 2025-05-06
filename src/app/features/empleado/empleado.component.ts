import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-empleado",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./empleado.component.html",
  styleUrls: ["./empleado.component.css"],
})
export class EmpleadoComponent {
  restaurantInfo: any = {}
  pendingOrders: any[] = []
  inProgressOrders: any[] = []
  completedOrders: any[] = []
  selectedOrder: any = null
  isLoading = false

  orderFilter = "all"
  searchTerm = ""

  constructor() {}

  acceptOrder(order: any): void {
    order.status = "in-progress"
    order.estimatedDelivery = this.getEstimatedDeliveryTime()
    this.inProgressOrders.push(order)
    this.pendingOrders = this.pendingOrders.filter((o) => o.id !== order.id)
  }

  completeOrder(order: any): void {
    order.status = "completed"
    order.completedAt = this.getCurrentTime()
    this.completedOrders.push(order)
    this.inProgressOrders = this.inProgressOrders.filter((o) => o.id !== order.id)
  }

  rejectOrder(order: any): void {
    // En un caso real, aquí se enviaría la información al backend
    this.pendingOrders = this.pendingOrders.filter((o) => o.id !== order.id)
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order
  }

  closeOrderDetails(): void {
    this.selectedOrder = null
  }

  getEstimatedDeliveryTime(): string {
    const now = new Date()
    const estimatedMinutes = 30 + Math.floor(Math.random() * 15) // Entre 30 y 45 minutos
    now.setMinutes(now.getMinutes() + estimatedMinutes)
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  getCurrentTime(): string {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  getFilteredOrders() {
    let orders: any[] = []

    if (this.orderFilter === "all" || this.orderFilter === "pending") {
      orders = [...orders, ...this.pendingOrders]
    }

    if (this.orderFilter === "all" || this.orderFilter === "in-progress") {
      orders = [...orders, ...this.inProgressOrders]
    }

    if (this.orderFilter === "all" || this.orderFilter === "completed") {
      orders = [...orders, ...this.completedOrders]
    }

    // Aplicar búsqueda si hay término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase()
      orders = orders.filter(
        (order) => order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term),
      )
    }

    return orders
  }
}
