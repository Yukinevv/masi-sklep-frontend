import { Component, OnInit } from '@angular/core';
import { Product } from '../../modules/Product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = []

  filteredProducts: Product[] = []

  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private productService: ProductService, private authService: AuthService,
    private router: Router, private cartService: CartService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.getUserEmail() != null ? true: false;

    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products.push(...response);
        this.filteredProducts = this.products.filter(product => product.quantity !== null);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }

  handleAddToCart(event: { product: Product, quantity: number }) {
    this.cartService.addItem(event.product, event.quantity);
  }

  applyFilterByName(filterValue: string) {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  applySort(sortDirection: string) {
    this.filteredProducts.sort((a, b) => {
      if (a.name < b.name) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a.name > b.name) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  addProduct(newProduct: Product) {
    newProduct.id = this.products.length + 1;

    // wyslanie produktu do api
    this.productService.addProduct(newProduct).subscribe({
      next: (response) => {
        console.log('Product added successful', response);
        this.products.push(newProduct);
      },
      error: (error) => {
        console.error('Product adding failed', error);
      }
    });
  }

  deleteProduct(id: number) {
    this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
  }

}
