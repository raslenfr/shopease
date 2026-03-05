import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order, OrderItem } from '../../../core/services/order.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];
    isLoading = true;
    errorMsg = '';
    isAdmin = false;

    statusColors: Record<string, string> = {
        PENDING: '#f39c12',
        CONFIRMED: '#3498db',
        SHIPPED: '#8e44ad',
        DELIVERED: '#2ed573',
        CANCELLED: '#ff4757'
    };

    constructor(private orderService: OrderService, private keycloak: KeycloakService) { }

    ngOnInit(): void {
        this.isAdmin = this.keycloak.isUserInRole('ROLE_ADMIN');
        this.loadOrders();
    }

    loadOrders(): void {
        this.isLoading = true;
        this.orderService.getAll().subscribe({
            next: (data: Order[]) => {
                this.orders = data;
                this.isLoading = false;
            },
            error: () => {
                this.errorMsg = 'Failed to load orders.';
                this.isLoading = false;
            }
        });
    }

    updateStatus(id: number, status: string): void {
        this.orderService.updateStatus(id, status).subscribe({
            next: () => this.loadOrders()
        });
    }

    getOrderTotal(order: Order): number {
        return order.items.reduce((sum: number, item: OrderItem) => sum + item.unitPrice * item.quantity, 0);
    }

    statusColor(status: string): string {
        return this.statusColors[status] ?? '#aaa';
    }
}
