import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  product: Product | null = null;

  selectedQuantity: number = 1;

  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private productSharingService: ProductSharingService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productSharingService.getCurrentProduct();

      if (!this.product || this.product.id !== productId) {
        this.router.navigate(['/products']);
      }

      this.isAdmin = this.authService.isAdmin();
    });
  }

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

  addToCart() {
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product!.quantity) {
      this.cartService.addItem(this.product!, this.selectedQuantity);

      this.snackBar.open('Produkt dodany do koszyka', 'Zamknij', {
        duration: 2000,
      });
    }
  }

}
