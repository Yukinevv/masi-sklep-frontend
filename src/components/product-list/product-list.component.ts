import { Component } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [
    new Product(1, 'Produkt 1', 'Opis produktu 1', 100, 'telefony', 'urlDoObrazka1'),
    new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'telewizory', 'urlDoObrazka2'),
    new Product(3, 'Produkt 3', 'Opis produktu 3', 300, 'komputery', 'urlDoObrazka3'),
    new Product(4, 'Produkt 4', 'Opis produktu 4', 400, 'komputery', 'urlDoObrazka4'),
    new Product(5, 'Produkt 5', 'Opis produktu 5', 500, 'telewizory', 'urlDoObrazka5'),
  ];

  filteredProducts: Product[] = this.products;

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
    this.products.push(newProduct);
  }

  deleteProduct(id: number) {
    this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
  }

}
