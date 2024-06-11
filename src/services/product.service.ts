import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../modules/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /**
   * Base URL for the API.
   * @type {string}
   */
  private apiUrl = 'http://localhost:8090';

  /**
   * Creates an instance of ProductService.
   *
   * @param {HttpClient} http - HTTP client to make requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of products from the server.
   *
   * @returns {Observable<Product[]>} Observable of the product list.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Adds a new product to the server.
   *
   * @param {Product} productData - The data of the product to add.
   * @returns {Observable<string>} Observable of the server response as text.
   */
  addProduct(productData: Product): Observable<string> {
    return this.http.post(`${this.apiUrl}/product`, productData, { responseType: 'text' });
  }

  /**
   * Updates an existing product on the server.
   *
   * @param {Product} product - The updated product data.
   * @returns {Observable<Product>} Observable of the updated product.
   */
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product`, product);
  }

  /**
   * Deletes a product from the server.
   *
   * @param {number} productId - The ID of the product to delete.
   * @returns {Observable<any>} Observable of the delete operation response.
   */
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
