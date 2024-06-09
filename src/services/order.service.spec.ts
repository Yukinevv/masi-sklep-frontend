import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Order } from '../modules/Order';

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrderService]
        });

        service = TestBed.inject(OrderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should list orders', () => {
        const mockOrders: Order[] = [
            {
                orderId: 1,
                date: '2023-06-10',
                products: [
                    { productId: 1, name: 'Product 1', description: 'Description 1', price: 100, quantity: 2 },
                    { productId: 2, name: 'Product 2', description: 'Description 2', price: 200, quantity: 1 }
                ]
            },
            {
                orderId: 2,
                date: '2023-06-11',
                products: [
                    { productId: 3, name: 'Product 3', description: 'Description 3', price: 150, quantity: 3 }
                ]
            }
        ];

        service.listOrders().subscribe(orders => {
            expect(orders).toEqual(mockOrders);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/orders`);
        expect(req.request.method).toBe('GET');
        req.flush(mockOrders);
    });
});
