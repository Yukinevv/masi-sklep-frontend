import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../modules/Product';
import { ProductSharingService } from '../../services/product-sharing.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productSharingService: ProductSharingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.productSharingService.getCurrentProduct();

      if (!this.product || this.product.id !== productId) {
        this.router.navigate(['/products']);
      }
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

}
