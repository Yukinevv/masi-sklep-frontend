import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductDetailsComponent Integration', () => {
    let component: ProductDetailsComponent;
    let fixture: ComponentFixture<ProductDetailsComponent>;
    let productService: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductDetailsComponent],
            imports: [HttpClientTestingModule],
            providers: [
                ProductService,
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({ id: 1 }) }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductDetailsComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);

        component.product = {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            quantity: 10,
            imageUrl: 'test.jpg'
        };

        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch product details and display', () => {
        component.ngOnInit();

        const req = httpMock.expectOne('http://localhost:8090/products/1');
        expect(req.request.method).toBe('GET');
        req.flush(component.product);

        fixture.detectChanges();

        expect(component.product?.name).toBe('Test Product');
    });
});
