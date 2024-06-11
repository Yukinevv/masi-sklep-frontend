import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../modules/Product';
import { ProductSharingService } from '../../services/product-sharing.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  /**
   * The product to display in the view.
   * @type {Product}
   */
  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageUrl: ''
  }

  /**
   * Event emitted when a product is deleted.
   * @type {EventEmitter<number>}
   */
  @Output() deleteProductEvent = new EventEmitter<number>();

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
   * Creates an instance of ProductViewComponent.
   *
   * @param {ProductSharingService} productSharingService - Service to share product data.
   * @param {ProductService} productService - Service to handle product operations.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   * @param {MatDialog} dialog - Service to handle dialog operations.
   * @param {CartService} cartService - Service to handle cart operations.
   */
  constructor(
    private productSharingService: ProductSharingService,
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cartService: CartService
  ) { }

  /**
   * Initializes the component.
   * Checks if the logged-in user is an admin.
   */
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  /**
   * Selects a product and shares it using the ProductSharingService.
   *
   * @param {Product} product - The product to select.
   */
  selectProduct(product: Product): void {
    this.productSharingService.setCurrentProduct(product);
  }

  /**
   * Adds the selected quantity of the product to the cart.
   * Displays a snack bar notification on success or error.
   */
  addToCart(): void {
    if (this.selectedQuantity > 0 && this.selectedQuantity <= this.product.quantity) {
      const added = this.cartService.addItem(this.product, this.selectedQuantity);
      if (added) {
        this.snackBar.open('Produkt dodany do koszyka', 'Zamknij', {
          duration: 2000,
        });
      } else {
        this.snackBar.open(`Maksymalna dostępna ilość to ${this.product.quantity}`, 'Zamknij', {
          duration: 2000,
        });
      }
    }
  }

  /**
   * Deletes a product after confirming with the user.
   * Emits deleteProductEvent on successful deletion.
   *
   * @param {number} id - The ID of the product to delete.
   */
  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: (response) => {
            console.log('Product deleted successfully', response);
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
