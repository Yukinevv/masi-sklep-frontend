import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('CartComponent Integration', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let cartServiceMock: any;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        cartServiceMock = {
            items$: of([]),
            removeItem: jasmine.createSpy('removeItem'),
            clearCart: jasmine.createSpy('clearCart'),
            placeOrder: jasmine.createSpy('placeOrder').and.returnValue(of({}))
        };

        authServiceMock = {
            getToken: jasmine.createSpy('getToken').and.returnValue('mock-token')
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        await TestBed.configureTestingModule({
            declarations: [CartComponent],
            imports: [
                RouterTestingModule.withRoutes([]),
                MatSnackBarModule,
                BrowserAnimationsModule // Importowanie modułu animacji
            ],
            providers: [
                { provide: CartService, useValue: cartServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
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

    it('should redirect to login if not authenticated', () => {
        authServiceMock.getToken.and.returnValue(null);
        component.ngOnInit();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should display cart items', () => {
        const mockCartItems = [
            { product: { id: 1, name: 'Product 1', price: 100, imageUrl: 'image1.jpg' }, quantity: 2 },
            { product: { id: 2, name: 'Product 2', price: 200, imageUrl: 'image2.jpg' }, quantity: 1 }
        ];
        cartServiceMock.items$ = of(mockCartItems);

        component.ngOnInit();
        fixture.detectChanges();

        const cartItemElements = fixture.debugElement.queryAll(By.css('.cart-item'));
        expect(cartItemElements.length).toBe(2);
    });

    it('should remove an item from the cart', () => {
        component.removeItem(1);
        expect(cartServiceMock.removeItem).toHaveBeenCalledWith(1);
    });

    it('should clear the cart', () => {
        component.clearCart();
        expect(cartServiceMock.clearCart).toHaveBeenCalled();
    });

    it('should place an order and show success message', () => {
        const mockCartItems = [
            { product: { id: 1, name: 'Product 1', price: 100, imageUrl: 'image1.jpg' }, quantity: 2 }
        ];
        cartServiceMock.items$ = of(mockCartItems);
        component.ngOnInit();
        fixture.detectChanges();

        component.placeOrder();
        expect(cartServiceMock.placeOrder).toHaveBeenCalledWith(mockCartItems);

        fixture.detectChanges(); // Uruchomienie detekcji zmian po wykonaniu placeOrder

        // Sprawdzenie, czy Snackbar z sukcesem został wyświetlony
        const snackBarElement = document.querySelector('simple-snack-bar');
        expect(snackBarElement?.textContent).toContain('Zamówienie zostało złożone pomyślnie!');
    });

    it('should show error message on order failure', () => {
        cartServiceMock.placeOrder.and.returnValue(throwError('Order failed'));

        const mockCartItems = [
            { product: { id: 1, name: 'Product 1', price: 100, imageUrl: 'image1.jpg' }, quantity: 2 }
        ];
        cartServiceMock.items$ = of(mockCartItems);
        component.ngOnInit();
        fixture.detectChanges();

        component.placeOrder();

        fixture.detectChanges(); // Uruchomienie detekcji zmian po wykonaniu placeOrder

        // Sprawdzenie, czy Snackbar z błędem został wyświetlony
        const snackBarElement = document.querySelector('simple-snack-bar');
        expect(snackBarElement?.textContent).toContain('Wystąpił błąd przy składaniu zamówienia.');
    });

    it('should show empty cart message when no items in cart', () => {
        cartServiceMock.items$ = of([]);
        component.ngOnInit();
        fixture.detectChanges();

        const emptyCartMessage = fixture.debugElement.query(By.css('.empty-cart-message'));
        expect(emptyCartMessage).toBeTruthy();
    });
});
