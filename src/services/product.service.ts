import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../modules/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8090';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  addProduct(productData: Product) {
    return this.http.post(`${this.apiUrl}/product`, productData, { responseType: 'text' });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product`, product);
  }

  // deleteProduct(id: number) {
  //   return this.http.delete(`${this.apiUrl}/product${id}`);
  // }

  deleteProduct(productId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ id: productId })
    };
    return this.http.delete(`${this.apiUrl}/product`, httpOptions);
  }
}
