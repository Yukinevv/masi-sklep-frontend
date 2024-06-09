import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CartItem } from '../../modules/CartItem';
import { Product } from '../../modules/Product';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    cartServiceMock = {
      items$: of([]),
      removeItem: jasmine.createSpy('removeItem'),
      clearCart: jasmine.createSpy('clearCart'),
      placeOrder: jasmine.createSpy('placeOrder').and.returnValue(of({}))
    };

    authServiceMock = {
      getToken: jasmine.createSpy('getToken').and.returnValue('some-token')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    snackBarMock = {
      open: jasmine.createSpy('open')
    };

    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not authenticated', () => {
    authServiceMock.getToken.and.returnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load cart items on init', () => {
    const cartItems: CartItem[] = [{ product: new Product(1, 'Product 1', 'Description 1', 100, 10), quantity: 1 }];
    cartServiceMock.items$ = of(cartItems);
    component.ngOnInit();
    expect(component.cartItems).toEqual(cartItems);
  });

  it('should remove item from cart', () => {
    component.removeItem(1);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith(1);
  });

  it('should clear cart', () => {
    component.clearCart();
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
  });

  it('should place order successfully', () => {
    const cartItems: CartItem[] = [{ product: new Product(1, 'Product 1', 'Description 1', 100, 10), quantity: 1 }];
    component.cartItems = cartItems;
    component.placeOrder();
    expect(cartServiceMock.placeOrder).toHaveBeenCalledWith(cartItems);
    expect(snackBarMock.open).toHaveBeenCalledWith('Zamówienie zostało złożone pomyślnie!', 'Zamknij', { duration: 3000 });
  });

  it('should handle order placement error', () => {
    cartServiceMock.placeOrder.and.returnValue(throwError({ error: 'error' }));
    const cartItems: CartItem[] = [{ product: new Product(1, 'Product 1', 'Description 1', 100, 10), quantity: 1 }];
    component.cartItems = cartItems;
    component.placeOrder();
    expect(snackBarMock.open).toHaveBeenCalledWith('Wystąpił błąd przy składaniu zamówienia.', 'Zamknij', { duration: 3000 });
  });
});
