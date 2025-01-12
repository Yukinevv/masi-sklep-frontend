import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRegistrationComponent } from './user-registration.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('UserRegistrationComponent', () => {
    let component: UserRegistrationComponent;
    let fixture: ComponentFixture<UserRegistrationComponent>;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        authServiceMock = {
            register: jasmine.createSpy('register').and.returnValue(of({}))
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate'),
            events: of({}),
            url: '',
            routerState: { root: {} }
        };

        await TestBed.configureTestingModule({
            declarations: [UserRegistrationComponent],
            imports: [
                ReactiveFormsModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule,
                MatButtonModule
            ],
            providers: [
                FormBuilder,
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form on component creation', () => {
        expect(component.registerForm).toBeDefined();
        expect(component.registerForm.controls['email']).toBeDefined();
        expect(component.registerForm.controls['password']).toBeDefined();
        expect(component.registerForm.controls['confirmPassword']).toBeDefined();
    });

    it('should validate that passwords match', () => {
        const formGroup = component.registerForm;
        formGroup.controls['password'].setValue('password123');
        formGroup.controls['confirmPassword'].setValue('password321');
        formGroup.updateValueAndValidity();

        expect(formGroup.controls['confirmPassword'].errors?.['mustMatch']).toBeTruthy();
    });

    it('should not submit form if invalid', () => {
        component.onSubmit();
        expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('should submit form and navigate to products on success', () => {
        component.registerForm.controls['name'].setValue('Test');
        component.registerForm.controls['surname'].setValue('User');
        component.registerForm.controls['address'].setValue('123 Test Street');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password123');

        component.onSubmit();
        expect(authServiceMock.register).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should handle registration failure', () => {
        authServiceMock.register.and.returnValue(throwError('Registration failed'));
        component.registerForm.controls['name'].setValue('Test');
        component.registerForm.controls['surname'].setValue('User');
        component.registerForm.controls['address'].setValue('123 Test Street');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password123');

        component.onSubmit();
        expect(component.isRegistrationFailed).toBeTrue();
    });
});
