import { TestBed } from '@angular/core/testing';
import { AuthService, LoginResponse } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { User } from '../modules/User';
import * as jwt_decode from 'jwt-decode';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerMock: any;

    beforeEach(() => {
        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register a user', () => {
        const mockUser: User = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test',
            surname: 'User',
            address: '123 Test Street'
        };

        service.register(mockUser).subscribe(response => {
            expect(response).toEqual(mockUser);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/register`);
        expect(req.request.method).toBe('POST');
        req.flush(mockUser);

        expect(localStorage.getItem('userEmail')).toBe(mockUser.email);
        expect(service.getUserEmail()).toBe(mockUser.email);
    });

    it('should login a user and store token', () => {
        const mockLoginResponse: LoginResponse = {
            token: 'mock-jwt-token'
        };

        const email = 'test@example.com';
        const password = 'password123';

        service.login(email, password).subscribe(response => {
            expect(response).toEqual(mockLoginResponse);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/login`);
        expect(req.request.method).toBe('POST');
        req.flush(mockLoginResponse);

        expect(localStorage.getItem('jwt_token')).toBe(mockLoginResponse.token);
        expect(localStorage.getItem('userEmail')).toBe(email);
        expect(service.getUserEmail()).toBe(email);
    });

    it('should logout a user', () => {
        localStorage.setItem('jwt_token', 'mock-jwt-token');
        localStorage.setItem('userEmail', 'test@example.com');

        service.logout();

        expect(localStorage.getItem('jwt_token')).toBeNull();
        expect(localStorage.getItem('userEmail')).toBeNull();
        expect(service.getUserEmail()).toBeNull();
    });

    // it('should decode a token', () => {
    //     const mockDecodedToken = {
    //         roles: 'ROLE_ADMIN,ROLE_USER',
    //         exp: Math.floor(Date.now() / 1000) + 60 * 60
    //     };

    //     spyOn(service, 'getToken').and.returnValue('mock-jwt-token');
    //     spyOn(jwt_decode, 'default').and.returnValue(mockDecodedToken);

    //     const decodedToken = service.decodeToken();
    //     expect(decodedToken).toEqual(mockDecodedToken);
    // });

    it('should return if user is admin', () => {
        const mockDecodedToken = {
            roles: 'ROLE_ADMIN,ROLE_USER',
            exp: Math.floor(Date.now() / 1000) + 60 * 60
        };

        spyOn(service, 'decodeToken').and.returnValue(mockDecodedToken);

        expect(service.isAdmin()).toBeTrue();
    });

    it('should return if user is not admin', () => {
        const mockDecodedToken = {
            roles: 'ROLE_USER',
            exp: Math.floor(Date.now() / 1000) + 60 * 60
        };

        spyOn(service, 'decodeToken').and.returnValue(mockDecodedToken);

        expect(service.isAdmin()).toBeFalse();
    });
});
