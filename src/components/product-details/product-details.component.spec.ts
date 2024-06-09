// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ProductDetailsComponent } from './product-details.component';
// import { ProductService } from '../../services/product.service';
// import { AuthService } from '../../services/auth.service';
// import { of } from 'rxjs';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

// describe('ProductDetailsComponent', () => {
//   let component: ProductDetailsComponent;
//   let fixture: ComponentFixture<ProductDetailsComponent>;
//   let productServiceMock: any;
//   let authServiceMock: any;

//   beforeEach(async () => {
//     productServiceMock = jasmine.createSpyObj('ProductService', ['updateProduct']);
//     authServiceMock = jasmine.createSpyObj('AuthService', ['isAdmin']);
//     authServiceMock.isAdmin.and.returnValue(true);

//     await TestBed.configureTestingModule({
//       declarations: [ProductDetailsComponent],
//       imports: [RouterTestingModule, MatSnackBarModule],
//       providers: [
//         { provide: ProductService, useValue: productServiceMock },
//         { provide: AuthService, useValue: authServiceMock }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ProductDetailsComponent);
//     component = fixture.componentInstance;
//     component.product = {
//       id: 1,
//       name: 'Test Product',
//       description: 'Test Description',
//       price: 100,
//       quantity: 10,
//       imageUrl: 'test.jpg'
//     };
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call updateProduct on saveProduct', () => {
//     productServiceMock.updateProduct.and.returnValue(of(component.product));
//     component.saveProduct();
//     expect(productServiceMock.updateProduct).toHaveBeenCalledWith(component.product);
//   });
// });
