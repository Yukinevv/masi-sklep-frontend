import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../modules/Product';
import { ProductSharingService } from '../../services/product-sharing.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  /**
   * The product to display details for.
   * @type {Product | null}
   */
  product: Product | null = null;

  /**
   * The quantity of the product selected by the user.
   * @type {number}
   */
  selectedQuantity: number = 1;

  /**
   * Indicates whether the logged-in user is an admin.
   * @type {boolean}
   */
  isAdmin: boolean = false;

  /**
   * Creates an instance of ProductDetailsComponent.
   *
   * @param {ActivatedRoute} route - Service to access route parameters.
   * @param {ProductService} productService - Service to handle product operations.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {ProductSharingService} productSharingService - Service to share product data.
   * @param {CartService} cartService - Service to handle cart operations.
   * @param {Router} router - Router service to navigate between routes.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   */
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private productSharingService: ProductSharingService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Initializes the component.
   * Fetches product details and checks if the user is an admin.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productSharingService.getCurrentProduct();

      if (!this.product || this.product.id !== productId) {
        this.router.navigate(['/products']);
      }

      this.isAdmin = this.authService.isAdmin();
    });
  }

  /**
   * Saves the updated product details.
   * Navigates to the product list on success.
   */
  saveProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.product).subscribe({
        next: (updatedProduct) => {
          console.log('Product updated successfully:', updatedProduct);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
  }

  /**
   * Adds the selected quantity of the product to the cart.
   * Displays a snack bar notification on success or error.
   */
  addToCart(): void {
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product!.quantity) {
      const added = this.cartService.addItem(this.product!, this.selectedQuantity);
      if (added) {
        this.snackBar.open('Produkt dodany do koszyka', 'Zamknij', {
          duration: 2000,
        });
      } else {
        this.snackBar.open(`Maksymalna dostępna ilość to ${this.product!.quantity}`, 'Zamknij', {
          duration: 2000,
        });
      }
    }
  }

}
