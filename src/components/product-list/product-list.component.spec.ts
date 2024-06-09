import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Product } from '../../modules/Product';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { ProductViewComponent } from '../product-view/product-view.component';
import { ProductManageComponent } from '../product-manage/product-manage.component';
import { ImageManageComponent } from '../image-manage/image-manage.component';
import { HttpClientModule } from '@angular/common/http';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productServiceMock: any;
    let authServiceMock: any;
    let cartServiceMock: any;

    const mockProducts: Product[] = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 100, quantity: 10, imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 200, quantity: 5, imageUrl: 'https://via.placeholder.com/150' }
    ];

    beforeEach(async () => {
        productServiceMock = {
            getProducts: jasmine.createSpy('getProducts').and.returnValue(of(mockProducts)),
            addProduct: jasmine.createSpy('addProduct').and.returnValue(of(mockProducts[0]))
        };

        authServiceMock = {
            isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true),
            getUserEmail: jasmine.createSpy('getUserEmail').and.returnValue('test@example.com')
        };

        cartServiceMock = {
            addItem: jasmine.createSpy('addItem')
        };

        await TestBed.configureTestingModule({
            declarations: [
                ProductListComponent,
                ProductFilterComponent,
                ProductViewComponent,
                ProductManageComponent,
                ImageManageComponent
            ],
            imports: [
                FormsModule,
                NoopAnimationsModule,
                MatSnackBarModule,
                MatButtonModule,
                RouterTestingModule,
                MatDialogModule,
                HttpClientModule
            ],
            providers: [
                { provide: ProductService, useValue: productServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: CartService, useValue: cartServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        // Resetowanie stanu komponentu przed każdym testem
        component.products = [];
        component.filteredProducts = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with products and set admin and logged in status', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.products.length).toBe(2);
        expect(component.filteredProducts.length).toBe(2);
        expect(component.isAdmin).toBeTrue();
        expect(component.isLoggedIn).toBeTrue();
    });

    it('should handle error when fetching products', () => {
        productServiceMock.getProducts.and.returnValue(throwError('Error fetching products'));
        const consoleSpy = spyOn(console, 'error');

        component.ngOnInit();
        fixture.detectChanges();

        expect(consoleSpy).toHaveBeenCalledWith('Error fetching products', 'Error fetching products');
    });

    it('should filter products by name', () => {
        component.products = mockProducts;
        component.applyFilterByName('Product 1');
        fixture.detectChanges();

        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].name).toBe('Product 1');
    });

    it('should sort products in ascending order by name', () => {
        component.products = mockProducts;
        component.applySort('asc');
        fixture.detectChanges();

        expect(component.filteredProducts[0].name).toBe('Product 1');
        expect(component.filteredProducts[1].name).toBe('Product 2');
    });

    it('should sort products in descending order by name', () => {
        component.products = mockProducts;
        component.applySort('desc');
        fixture.detectChanges();

        expect(component.filteredProducts[0].name).toBe('Product 2');
        expect(component.filteredProducts[1].name).toBe('Product 1');
    });

    it('should add product to cart', () => {
        const productToAdd = mockProducts[0];
        component.handleAddToCart({ product: productToAdd, quantity: 1 });

        expect(cartServiceMock.addItem).toHaveBeenCalledWith(productToAdd, 1);
    });

    it('should add new product and update product list', () => {
        const newProduct: Product = {
            id: 3,
            name: 'Product 3',
            description: 'Description 3',
            price: 300,
            quantity: 8,
            imageUrl: 'https://via.placeholder.com/150'
        };

        component.addProduct(newProduct);
        fixture.detectChanges();

        expect(productServiceMock.addProduct).toHaveBeenCalledWith(newProduct);
        expect(component.products.length).toBe(3);
        expect(component.filteredProducts.length).toBe(3);
    });

    it('should delete product from list', () => {
        component.products = mockProducts;
        component.filteredProducts = [...mockProducts];

        component.deleteProduct(1);
        fixture.detectChanges();

        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].id).toBe(2);
    });
});
