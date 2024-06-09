import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManageComponent } from './product-manage.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Product } from '../../modules/Product';
import { ImageManageComponent } from '../image-manage/image-manage.component';

describe('ProductManageComponent', () => {
    let component: ProductManageComponent;
    let fixture: ComponentFixture<ProductManageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductManageComponent, ImageManageComponent],
            imports: [FormsModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductManageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add product and emit event', () => {
        const newProduct: Product = { id: 1, name: 'Test Product', description: 'Test Description', price: 100, quantity: 10, imageUrl: 'test-image-url' };

        component.newProduct = newProduct;
        spyOn(component.addProductEvent, 'emit');

        const form = fixture.debugElement.query(By.css('form')).nativeElement;
        form.dispatchEvent(new Event('submit'));

        expect(component.addProductEvent.emit).toHaveBeenCalledWith(newProduct);
        expect(component.newProduct).toEqual({ id: 0, name: '', description: '', price: 0, quantity: 0, imageUrl: '' });
    });

    it('should update product image URL on image load', () => {
        const base64Image = 'data:image/png;base64,test-image';
        component.onImageLoaded(base64Image);
        expect(component.newProduct.imageUrl).toBe(base64Image);
    });
});
