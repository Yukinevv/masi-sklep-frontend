import { TestBed } from '@angular/core/testing';
import { ProductSharingService } from './product-sharing.service';
import { Product } from '../modules/Product';

describe('ProductSharingService', () => {
    let service: ProductSharingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProductSharingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get the current product', () => {
        const mockProduct: Product = {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            quantity: 10,
            imageUrl: 'https://via.placeholder.com/150'
        };

        service.setCurrentProduct(mockProduct);
        const currentProduct = service.getCurrentProduct();
        expect(currentProduct).toEqual(mockProduct);
    });

    it('should return null if no product is set', () => {
        const currentProduct = service.getCurrentProduct();
        expect(currentProduct).toBeNull();
    });
});
