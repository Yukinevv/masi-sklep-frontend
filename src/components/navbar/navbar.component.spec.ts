import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let authServiceMock: any;
    let cartServiceMock: any;
    let router: Router;

    beforeEach(async () => {
        authServiceMock = {
            userEmail: of(null),
            logout: jasmine.createSpy('logout')
        };

        cartServiceMock = {
            getTotalQuantity: jasmine.createSpy('getTotalQuantity').and.returnValue(of(0))
        };

        await TestBed.configureTestingModule({
            declarations: [NavbarComponent, DummyComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'registration', component: DummyComponent },
                    { path: 'login', component: DummyComponent },
                    { path: 'products', component: DummyComponent },
                    { path: 'product-details/:id', component: DummyComponent },
                    { path: 'cart', component: DummyComponent },
                    { path: 'orders', component: DummyComponent },
                    { path: '', redirectTo: '/products', pathMatch: 'full' },
                ]),
                MatToolbarModule,
                MatIconModule,
                MatButtonModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: CartService, useValue: cartServiceMock }
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with user email and cart item count', () => {
        authServiceMock.userEmail = of('test@example.com');
        cartServiceMock.getTotalQuantity.and.returnValue(of(5));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.userEmail).toBe('test@example.com');
        expect(component.isLoggedIn).toBeTrue();
        expect(component.cartItemCount).toBe(5);
    });

    // it('should call logout and navigate to products on logout', async () => {
    //     spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    //     component.logout();
    //     expect(authServiceMock.logout).toHaveBeenCalled();
    //     await fixture.whenStable();
    //     expect(router.navigate).toHaveBeenCalledWith(['/products']);
    // });

    it('should display user email when logged in', () => {
        component.userEmail = 'test@example.com';
        component.isLoggedIn = true;
        fixture.detectChanges();

        const userEmailElement = fixture.debugElement.query(By.css('.user-email')).nativeElement;
        expect(userEmailElement.textContent).toContain('test@example.com');
    });

    it('should display cart item count when there are items in the cart', () => {
        component.cartItemCount = 3;
        fixture.detectChanges();

        const cartBadge = fixture.debugElement.query(By.css('.cart-badge')).nativeElement;
        expect(cartBadge.textContent).toContain('3');
    });
});

// DummyComponent jest używany do symulacji komponentów w trasach podczas testów
@Component({ template: '' })
class DummyComponent { }
