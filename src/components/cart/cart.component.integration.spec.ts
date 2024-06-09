// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CartComponent } from './cart.component';
// import { CartService } from '../../services/cart.service';
// import { AuthService } from '../../services/auth.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Dodane
// import { of, BehaviorSubject } from 'rxjs';
// import { CartItem } from '../../modules/CartItem';
// import { Product } from '../../modules/Product';

// describe('CartComponent Integration Test', () => {
//     let cartService: CartService;
//     let authService: AuthService;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [CartComponent],
//             imports: [
//                 HttpClientTestingModule,
//                 RouterTestingModule,
//                 MatSnackBarModule,
//                 BrowserAnimationsModule
//             ],
//             providers: [
//                 CartService,
//                 AuthService,
//                 { provide: AuthService, useValue: { getToken: () => 'some-token' } }
//             ]
//         }).compileComponents();

//         cartService = TestBed.inject(CartService);
//         authService = TestBed.inject(AuthService);
//     });

//     it('should load cart items and place order', (done) => {
//         const fixture = TestBed.createComponent(CartComponent);
//         const component = fixture.componentInstance;
//         const cartItems: CartItem[] = [{ product: new Product(1, 'Product 1', 'Description 1', 100, 10), quantity: 1 }];

//         const itemsSubject = new BehaviorSubject<CartItem[]>(cartItems);
//         (cartService as any).itemsSubject = itemsSubject; // Bezpośrednie przypisanie nowego BehaviorSubject
//         spyOn(cartService, 'placeOrder').and.returnValue(of({ success: true }));

//         // Zapewnij, że komponent subskrybuje items$ przed rozpoczęciem testu
//         component.ngOnInit();
//         fixture.detectChanges();

//         // Upewnij się, że aktualizacja komponentu jest asynchroniczna
//         itemsSubject.next(cartItems); // Ręczna aktualizacja przedmiotu itemsSubject

//         fixture.whenStable().then(() => {
//             // Sprawdzenie, czy cartItems w komponencie zostały zaktualizowane
//             expect(component.cartItems).toEqual(cartItems);

//             component.placeOrder(); // Wywołanie placeOrder
//             expect(cartService.placeOrder).toHaveBeenCalledWith(cartItems); // Sprawdzenie, czy placeOrder zostało wywołane z właściwymi argumentami
//             done();
//         });
//     });
// });
