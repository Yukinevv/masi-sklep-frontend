import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductSharingService } from '../../services/product-sharing.service';
import { ProductService } from '../../services/product.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductViewComponent } from './product-view.component';

describe('ProductViewComponent', () => {
    let component: ProductViewComponent;
    let fixture: ComponentFixture<ProductViewComponent>;
    let productSharingServiceMock: any;
    let productServiceMock: any;
    let authServiceMock: any;
    let snackBarMock: any;
    let dialogMock: any;
    let cartServiceMock: any;

    const mockProduct = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        quantity: 10,
        imageUrl: 'https://via.placeholder.com/150'
    };

    beforeEach(async () => {
        productSharingServiceMock = {
            setCurrentProduct: jasmine.createSpy('setCurrentProduct')
        };

        productServiceMock = {
            deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of({}))
        };

        authServiceMock = {
            isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true)
        };

        snackBarMock = {
            open: jasmine.createSpy('open')
        };

        dialogMock = {
            open: jasmine.createSpy('open').and.returnValue({
                afterClosed: () => of(true)
            })
        };

        cartServiceMock = {
            addItem: jasmine.createSpy('addItem').and.returnValue(true)
        };

        await TestBed.configureTestingModule({
            declarations: [ProductViewComponent, ConfirmDialogComponent],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatButtonModule,
                MatDialogModule,
                RouterTestingModule
            ],
            providers: [
                { provide: ProductSharingService, useValue: productSharingServiceMock },
                { provide: ProductService, useValue: productServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: CartService, useValue: cartServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductViewComponent);
        component = fixture.componentInstance;
        component.product = mockProduct;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with admin status', () => {
        component.ngOnInit();
        expect(component.isAdmin).toBeTrue();
        expect(authServiceMock.isAdmin).toHaveBeenCalled();
    });

    it('should add product to cart and show success message', () => {
        component.selectedQuantity = 1;
        component.addToCart();

        expect(cartServiceMock.addItem).toHaveBeenCalledWith(mockProduct, 1);
        expect(snackBarMock.open).toHaveBeenCalledWith('Produkt dodany do koszyka', 'Zamknij', { duration: 2000 });
    });

    it('should show error message if selected quantity is invalid', () => {
        component.selectedQuantity = 0;
        component.addToCart();

        expect(cartServiceMock.addItem).not.toHaveBeenCalled();
        expect(snackBarMock.open).not.toHaveBeenCalled();
    });

    it('should open confirm dialog and delete product on confirm', () => {
        spyOn(component.deleteProductEvent, 'emit');
        component.deleteProduct(mockProduct.id);

        expect(dialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent);
        expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
        expect(component.deleteProductEvent.emit).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should handle error when deleting product fails', () => {
        const consoleSpy = spyOn(console, 'error');
        dialogMock.open.and.returnValue({
            afterClosed: () => of(true)
        });
        productServiceMock.deleteProduct.and.returnValue(throwError('Error deleting product'));

        component.deleteProduct(mockProduct.id);

        expect(consoleSpy).toHaveBeenCalledWith('Product deleting failed', 'Error deleting product');
    });

    it('should set selected product on selectProduct call', () => {
        component.selectProduct(mockProduct);
        expect(productSharingServiceMock.setCurrentProduct).toHaveBeenCalledWith(mockProduct);
    });
});
