import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
    productId: number;
    productName?: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id?: number;
    createdAt?: Date;
    customerEmail: string;
    orderDate: Date;
    totalAmount: number;
    status: string;
    items: OrderItem[];
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Order[]> {
        // Backend has getMyOrders at /my-orders
        // For now, let's use my-orders as getAll might not be accessible to everyone
        return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
    }

    create(payload: any): Observable<Order> {
        // Map frontend 'items' to backend 'orderItems'
        const orderItems = payload.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity
        }));
        return this.http.post<Order>(this.apiUrl, { orderItems });
    }

    updateStatus(id: number, status: string): Observable<Order> {
        // This endpoint might not exist in backend yet, but keeping for frontend compatibility
        return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status });
    }
}
