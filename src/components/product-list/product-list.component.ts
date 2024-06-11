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
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  /**
   * Array of all products.
   * @type {Product[]}
   */
  products: Product[] = []

  /**
   * Array of products filtered based on certain criteria.
   * @type {Product[]}
   */
  filteredProducts: Product[] = []

  /**
   * Indicates whether the logged-in user is an admin.
   * @type {boolean}
   */
  isAdmin: boolean = false;

  /**
   * Indicates whether the user is logged in.
   * @type {boolean}
   */
  isLoggedIn: boolean = false;

  /**
   * Creates an instance of ProductListComponent.
   *
   * @param {ProductService} productService - Service to handle product operations.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {Router} router - Router service to navigate between routes.
   * @param {CartService} cartService - Service to handle cart operations.
   * @param {MatDialog} dialog - Service to handle dialog operations.
   */
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    public dialog: MatDialog
  ) { }

  /**
   * Initializes the component.
   * Fetches the list of products and sets the initial state of isAdmin and isLoggedIn.
   */
  ngOnInit(): void {
    this.products = [];
    this.filteredProducts = [];

    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.getUserEmail() != null ? true : false;

    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products.push(...response);
        this.filteredProducts = this.products.filter(product => product.quantity !== null && product.quantity !== 0);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  /**
   * Handles adding a product to the cart.
   *
   * @param {Object} event - The event object containing the product and quantity.
   * @param {Product} event.product - The product to add to the cart.
   * @param {number} event.quantity - The quantity of the product to add.
   */
  handleAddToCart(event: { product: Product, quantity: number }): void {
    this.cartService.addItem(event.product, event.quantity);
  }

  /**
   * Applies a filter to the product list based on the product name.
   *
   * @param {string} filterValue - The value to filter the products by.
   */
  applyFilterByName(filterValue: string): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue.toLowerCase()) && product.quantity !== null && product.quantity !== 0
    );
  }

  /**
   * Sorts the product list based on the product name.
   *
   * @param {string} sortDirection - The direction to sort the products ('asc' or 'desc').
   */
  applySort(sortDirection: string): void {
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

  /**
   * Adds a new product to the list and sends it to the server.
   *
   * @param {Product} newProduct - The product to add.
   */
  addProduct(newProduct: Product): void {
    newProduct.id = this.products.length + 1;

    this.productService.addProduct(newProduct).subscribe({
      next: (response) => {
        console.log('Product added successfully', response);
        this.products.push(newProduct);
        this.filteredProducts = this.products.filter(product => product.quantity !== null && product.quantity !== 0);
      },
      error: (error) => {
        console.error('Product adding failed', error);
      }
    });
  }

  /**
   * Deletes a product from the list based on its ID.
   *
   * @param {number} id - The ID of the product to delete.
   */
  deleteProduct(id: number): void {
    this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
  }

}
