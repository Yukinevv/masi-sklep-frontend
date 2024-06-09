import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLoginComponent } from './user-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('UserLoginComponent', () => {
    let component: UserLoginComponent;
    let fixture: ComponentFixture<UserLoginComponent>;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        authServiceMock = {
            login: jasmine.createSpy('login').and.returnValue(of({}))
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate'),
            // Dodanie root elementu
            events: of({}),
            url: '',
            routerState: { root: {} }
        };

        await TestBed.configureTestingModule({
            declarations: [UserLoginComponent],
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
        fixture = TestBed.createComponent(UserLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
        component.ngOnInit();
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.controls['email']).toBeDefined();
        expect(component.loginForm.controls['password']).toBeDefined();
    });

    it('should navigate to products if token is in localStorage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('jwt_token');
        component.ngOnInit();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should not navigate to products if token is not in localStorage', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        component.ngOnInit();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should display error messages for invalid form', () => {
        component.onSubmit();
        fixture.detectChanges();

        const emailError = fixture.debugElement.query(By.css('.error-text')).nativeElement;
        expect(emailError).toBeTruthy();
        expect(emailError.textContent).toContain('Email jest wymagany.');
    });

    it('should call authService.login and navigate to products on valid form submission', () => {
        component.ngOnInit();
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();
        fixture.detectChanges();

        expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should set isLoginFailed to true on login error', () => {
        authServiceMock.login.and.returnValue(throwError('Login failed'));
        component.ngOnInit();
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');
        component.onSubmit();
        fixture.detectChanges();

        expect(component.isLoginFailed).toBeTrue();
        const loginError = fixture.debugElement.query(By.css('.error-text')).nativeElement;
        expect(loginError).toBeTruthy();
        expect(loginError.textContent).toContain('Podano nieprawidłowe dane!');
    });
});
