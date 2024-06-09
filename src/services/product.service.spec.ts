import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../modules/Product';
import { HttpHeaders } from '@angular/common/http';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        });

        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch products', () => {
        const mockProducts: Product[] = [
            { id: 1, name: 'Product 1', description: 'Description 1', price: 100, quantity: 10, imageUrl: 'https://via.placeholder.com/150' },
            { id: 2, name: 'Product 2', description: 'Description 2', price: 200, quantity: 5, imageUrl: 'https://via.placeholder.com/150' }
        ];

        service.getProducts().subscribe(products => {
            expect(products).toEqual(mockProducts);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/products`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProducts);
    });

    it('should add a product', () => {
        const newProduct: Product = { id: 3, name: 'Product 3', description: 'Description 3', price: 150, quantity: 8, imageUrl: 'https://via.placeholder.com/150' };

        service.addProduct(newProduct).subscribe(response => {
            expect(response).toBe('Product added');
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/product`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newProduct);
        req.flush('Product added');
    });

    it('should update a product', () => {
        const updatedProduct: Product = { id: 1, name: 'Updated Product', description: 'Updated Description', price: 120, quantity: 12, imageUrl: 'https://via.placeholder.com/150' };

        service.updateProduct(updatedProduct).subscribe(product => {
            expect(product).toEqual(updatedProduct);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/product`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedProduct);
        req.flush(updatedProduct);
    });

    it('should delete a product', () => {
        const productId = 1;

        service.deleteProduct(productId).subscribe(response => {
            expect(response).toBe('Product deleted');
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/product`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Content-Type')).toBe('application/json');
        expect(req.request.body).toEqual(JSON.stringify({ id: productId }));
        req.flush('Product deleted');
    });
});
