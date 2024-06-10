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

  it('should add item to cart if quantity is valid', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    const result = service.addItem(product, 2);
    expect(result).toBeTrue();
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should not add item to cart if quantity exceeds available stock', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 5,
      imageUrl: 'https://via.placeholder.com/150'
    };
    const result = service.addItem(product, 10);
    expect(result).toBeFalse();
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should update item quantity in the cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    service.addItem(product, 2);
    service.updateItemQuantity(1, 5);
    service.items$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(5);
    });
  });

  it('should remove item from cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    service.addItem(product, 2);
    service.removeItem(1);
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should clear the cart', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    service.addItem(product, 2);
    service.clearCart();
    service.items$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should place an order', () => {
    const product: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    service.addItem(product, 2);

    service.placeOrder([{ product, quantity: 2 }]).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8090/order');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should calculate total quantity correctly', () => {
    const product1: Product = {
      id: 1, name: 'Product 1', price: 10,
      description: 'Description 1',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    const product2: Product = {
      id: 2, name: 'Product 2', price: 20,
      description: 'Description 2',
      quantity: 10,
      imageUrl: 'https://via.placeholder.com/150'
    };
    service.addItem(product1, 2);
    service.addItem(product2, 3);

    service.getTotalQuantity().subscribe(total => {
      expect(total).toBe(5);
    });
  });
});
