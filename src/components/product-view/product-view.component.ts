// product-view.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../modules/Product';
import { ProductSharingService } from '../../services/product-sharing.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {
  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    quantity: 0,
    imageUrl: ''
  }

  @Output() onAddToCart = new EventEmitter<{ product: Product, quantity: number }>();

  @Output() deleteProductEvent = new EventEmitter<number>();

  selectedQuantity: number = 1;

  constructor(private productSharingService: ProductSharingService, private productService: ProductService, public dialog: MatDialog) { }

  selectProduct(product: Product) {
    this.productSharingService.setCurrentProduct(product);
  }

  addToCart() {
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product.quantity) {
      this.onAddToCart.emit({ product: this.product, quantity: this.selectedQuantity });
    }
  }

  deleteProduct(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: (response) => {
            console.log('Product deleted successful', response);
            this.deleteProductEvent.emit(id);
          },
          error: (error) => {
            console.error('Product deleting failed', error);
          }
        });
      }
    });
  }

}
