import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    searchTerm = '';
    isLoading = true;
    isAdmin = false;
    errorMsg = '';

    showModal = false;
    isEditing = false;
    modalProduct: Product = { name: '', description: '', price: 0, stock: 0 };
    editingId?: number;

    constructor(private productService: ProductService, private keycloak: KeycloakService) { }

    ngOnInit(): void {
        this.isAdmin = this.keycloak.isUserInRole('ROLE_ADMIN');
        this.loadProducts();
    }

    loadProducts(): void {
        this.isLoading = true;
        this.productService.getAll().subscribe({
            next: (data: Product[]) => {
                this.products = data;
                this.filteredProducts = data;
                this.isLoading = false;
            },
            error: () => {
                this.errorMsg = 'Failed to load products.';
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        const term = this.searchTerm.toLowerCase();
        this.filteredProducts = this.products.filter(p =>
            p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
    }

    openCreate(): void {
        this.isEditing = false;
        this.modalProduct = { name: '', description: '', price: 0, stock: 0 };
        this.showModal = true;
    }

    openEdit(product: Product): void {
        this.isEditing = true;
        this.editingId = product.id;
        this.modalProduct = { ...product };
        this.showModal = true;
    }

    saveProduct(): void {
        if (this.isEditing && this.editingId !== undefined) {
            this.productService.update(this.editingId, this.modalProduct).subscribe({
                next: () => { this.closeModal(); this.loadProducts(); }
            });
        } else {
            this.productService.create(this.modalProduct).subscribe({
                next: () => { this.closeModal(); this.loadProducts(); }
            });
        }
    }

    deleteProduct(id: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.delete(id).subscribe({
                next: () => this.loadProducts(),
                error: (err) => {
                    if (err?.status === 409) {
                        const msg = err?.error?.message ?? 'Cannot delete product because it has existing orders.';
                        alert(msg);
                        return;
                    }
                    this.errorMsg = 'Failed to delete product.';
                }
            });
        }
    }

    closeModal(): void {
        this.showModal = false;
    }
}
