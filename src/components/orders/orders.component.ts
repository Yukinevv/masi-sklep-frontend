import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../modules/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  /**
   * Array of orders fetched from the server.
   * @type {Order[]}
   */
  orders: Order[] = [];

  /**
   * Creates an instance of OrdersComponent.
   *
   * @param {OrderService} orderService - Service to handle order operations.
   */
  constructor(private orderService: OrderService) { }

  /**
   * Initializes the component.
   * Fetches the list of orders and assigns them to the orders property.
   */
  ngOnInit(): void {
    this.orderService.listOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  /**
   * Sorts the orders based on their date.
   *
   * @param {'asc' | 'desc'} direction - The direction to sort the orders: ascending or descending.
   */
  sortOrders(direction: 'asc' | 'desc'): void {
    this.orders.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
}
