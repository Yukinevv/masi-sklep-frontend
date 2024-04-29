import { Component, OnInit } from '@angular/core';
import { Product } from '../../modules/Product';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductSharingService } from '../../services/product-sharing.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  // products: Product[] = [
  //   new Product(1, 'Produkt 1', 'Opis produktu 1', 100, 'telefony', 'urlDoObrazka1'),
  //   new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'telewizory', 'urlDoObrazka2'),
  //   new Product(3, 'Produkt 3', 'Opis produktu 3', 300, 'komputery', 'urlDoObrazka3'),
  //   new Product(4, 'Produkt 4', 'Opis produktu 4', 400, 'komputery', 'urlDoObrazka4'),
  //   new Product(5, 'Produkt 5', 'Opis produktu 5', 500, 'telewizory', 'urlDoObrazka5'),
  // ];

  products: Product[] = []

  filteredProducts: Product[] = []

  isAdmin = false;

  constructor(private productService: ProductService, private authService: AuthService,
    private router: Router, private productSharingService: ProductSharingService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // roboczo jezeli nie ma tokenu to przekierowuje na strone logowania
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
    }
    this.isAdmin = this.authService.isAdmin();

    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products.push(...response);
        this.filteredProducts = this.products.filter(product => product.quantity !== null);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
    // this.productService.getProducts().subscribe((data: any[]) => {
    //   this.products = data;
    //   this.filteredProducts = this.products.filter(product => product.quantity !== null);
    // });
  }

  logout(): void {
    this.authService.logout();
  }

  selectProduct(product: Product) {
    this.productSharingService.setCurrentProduct(product);
  }

  applyFilterByName(filterValue: string) {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  applyFilterByCategory(filterCategory: string) {
    this.filteredProducts = this.products.filter(product =>
      product.category.toLowerCase() === filterCategory.toLowerCase()
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: (response) => {
            console.log('Product deleted successful', response);
            this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
          },
          error: (error) => {
            console.error('Product deleting failed', error);
          }
        });
      }
    });
  }

}
