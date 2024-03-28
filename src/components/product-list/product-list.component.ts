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
    new Product(3, 'Produkt 3', 'Opis produktu 3', 300, 'urlDoObrazka3'),
    new Product(4, 'Produkt 4', 'Opis produktu 4', 400, 'urlDoObrazka4'),
    new Product(5, 'Produkt 5', 'Opis produktu 5', 500, 'urlDoObrazka5'),
  ];
}
