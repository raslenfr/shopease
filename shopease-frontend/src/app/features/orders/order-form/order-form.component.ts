import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
    productId!: number;
    productName!: string;
    unitPrice!: number;
    quantity = 1;
    isSubmitting = false;
    success = false;
    errorMsg = '';
    userEmail = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private keycloak: KeycloakService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.productId = +params['productId'];
            this.productName = params['productName'];
            this.unitPrice = +params['price'];
        });
        this.keycloak.loadUserProfile().then(profile => {
            this.userEmail = profile.email ?? '';
        });
    }

    get total(): number {
        return this.unitPrice * this.quantity;
    }

    placeOrder(): void {
        this.isSubmitting = true;
        this.errorMsg = '';
        const payload = {
            items: [{
                productId: this.productId,
                productName: this.productName,
                quantity: this.quantity,
                unitPrice: this.unitPrice
            }]
        };
        this.orderService.create(payload).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.success = true;
                setTimeout(() => this.router.navigate(['/orders']), 2500);
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMsg = err?.error?.message ?? 'Failed to place order. Please try again.';
            }
        });
    }
}
