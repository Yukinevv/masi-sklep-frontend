import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Product } from '../../modules/Product';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductSharingService } from '../../services/product-sharing.service';
import { ProductService } from '../../services/product.service';
import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
    let component: ProductDetailsComponent;
    let fixture: ComponentFixture<ProductDetailsComponent>;
    let productServiceMock: any;
    let productSharingServiceMock: any;
    let authServiceMock: any;
    let cartServiceMock: any;
    let router: Router;
    let snackBarMock: any;

    const mockProduct: Product = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        quantity: 10,
        imageUrl: 'https://via.placeholder.com/150'
    };

    beforeEach(async () => {
        productServiceMock = {
            updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of(mockProduct))
        };

        productSharingServiceMock = {
            getCurrentProduct: jasmine.createSpy('getCurrentProduct').and.returnValue(mockProduct)
        };

        authServiceMock = {
            isAdmin: jasmine.createSpy('isAdmin').and.returnValue(false)
        };

        cartServiceMock = {
            addItem: jasmine.createSpy('addItem')
        };

        snackBarMock = {
            open: jasmine.createSpy('open')
        };

        await TestBed.configureTestingModule({
            declarations: [ProductDetailsComponent],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatSnackBarModule,
                MatButtonModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: ProductService, useValue: productServiceMock },
                { provide: ProductSharingService, useValue: productSharingServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: CartService, useValue: cartServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 1 })
                    }
                }
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        spyOn(router, 'navigate'); // Upewniam się, że router.navigate jest szpiegiem
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch product on init', () => {
        expect(productSharingServiceMock.getCurrentProduct).toHaveBeenCalled();
        expect(component.product).toEqual(mockProduct);
    });

    it('should navigate to /products if product not found', () => {
        productSharingServiceMock.getCurrentProduct.and.returnValue(null);

        component.ngOnInit();
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should set isAdmin to true if user is admin', () => {
        authServiceMock.isAdmin.and.returnValue(true);

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isAdmin).toBeTrue();
    });

    it('should save product and navigate to /products', () => {
        component.product = mockProduct;
        component.saveProduct();

        expect(productServiceMock.updateProduct).toHaveBeenCalledWith(mockProduct);
        expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should show error if product save fails', () => {
        const consoleSpy = spyOn(console, 'error');
        productServiceMock.updateProduct.and.returnValue(throwError('Error updating product'));

        component.product = mockProduct;
        component.saveProduct();

        expect(consoleSpy).toHaveBeenCalledWith('Error updating product:', 'Error updating product');
    });

    it('should add product to cart and show snackbar', () => {
        component.product = mockProduct;
        component.selectedQuantity = 1;
        component.addToCart();

        expect(cartServiceMock.addItem).toHaveBeenCalledWith(mockProduct, 1);
        expect(snackBarMock.open).toHaveBeenCalledWith('Produkt dodany do koszyka', 'Zamknij', { duration: 2000 });
    });

    it('should not add product to cart if selected quantity is invalid', () => {
        component.product = mockProduct;
        component.selectedQuantity = 0;
        component.addToCart();

        expect(cartServiceMock.addItem).not.toHaveBeenCalled();
        expect(snackBarMock.open).not.toHaveBeenCalled();
    });
});
