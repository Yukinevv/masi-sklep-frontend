import { Component } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [
    new Product(1, 'Produkt 1', 'Opis produktu 1', 100, 'urlDoObrazka1'),
    new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'urlDoObrazka2'),
    new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'urlDoObrazka2'),
    new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'urlDoObrazka2'),
    new Product(2, 'Produkt 2', 'Opis produktu 2', 200, 'urlDoObrazka2'),
    // Dodaj więcej produktów według potrzeb
  ];
}
