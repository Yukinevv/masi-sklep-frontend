import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../modules/Product';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: '',
      quantity: 0
    };
    service.addItem(product);
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(product);
    });
  });

  it('should remove item from cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: '',
      quantity: 0
    };
    service.addItem(product);
    service.removeItem(1);
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should clear the cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: '',
      quantity: 0
    };
    service.addItem(product);
    service.clearCart();
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should place an order', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: '',
      quantity: 0
    };
    service.addItem(product);

    service.placeOrder([{ product, quantity: 1 }]).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8090/order');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should calculate total quantity correctly', () => {
    const product1: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: '',
      quantity: 0
    };
    const product2: Product = {
      id: 2, name: 'Product 2', price: 20,
      description: '',
      quantity: 0
    };
    service.addItem(product1, 2);
    service.addItem(product2, 3);

    service.getTotalQuantity().subscribe(total => {
      expect(total).toBe(5);
    });
  });
});
