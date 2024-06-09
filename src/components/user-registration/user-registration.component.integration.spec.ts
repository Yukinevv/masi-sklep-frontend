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
import { Location } from '@angular/common';
import { Component } from '@angular/core';

describe('UserRegistrationComponent Integration', () => {
    let component: UserRegistrationComponent;
    let fixture: ComponentFixture<UserRegistrationComponent>;
    let authServiceMock: any;
    let location: Location;

    beforeEach(async () => {
        authServiceMock = {
            register: jasmine.createSpy('register').and.returnValue(of({}))
        };

        await TestBed.configureTestingModule({
            declarations: [UserRegistrationComponent],
            imports: [
                ReactiveFormsModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([
                    { path: 'products', component: DummyComponent }
                ]),
                NoopAnimationsModule,
                MatButtonModule
            ],
            providers: [
                FormBuilder,
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserRegistrationComponent);
        component = fixture.componentInstance;
        location = TestBed.inject(Location);
        fixture.detectChanges();
    });

    it('should navigate to /products on successful registration', async () => {
        component.registerForm.controls['name'].setValue('Test');
        component.registerForm.controls['surname'].setValue('User');
        component.registerForm.controls['address'].setValue('123 Test Street');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password123');

        component.onSubmit();
        fixture.detectChanges();

        await fixture.whenStable(); // Czekamy na zakończenie operacji asynchronicznych

        expect(authServiceMock.register).toHaveBeenCalled();
        expect(location.path()).toBe('/products');
    });

    it('should display error message on registration failure', async () => {
        authServiceMock.register.and.returnValue(throwError('Registration failed'));
        component.registerForm.controls['name'].setValue('Test');
        component.registerForm.controls['surname'].setValue('User');
        component.registerForm.controls['address'].setValue('123 Test Street');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password123');

        component.onSubmit();
        fixture.detectChanges();

        await fixture.whenStable(); // Czekamy na zakończenie operacji asynchronicznych

        expect(component.isRegistrationFailed).toBeTrue();
        const errorMessage = fixture.debugElement.query(By.css('.error-text')).nativeElement;
        expect(errorMessage.textContent).toContain('Rejestracja nie powiodła się!');
    });
});

@Component({ template: '' })
class DummyComponent { }
