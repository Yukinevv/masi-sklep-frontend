// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [AuthService]
//     });
//     service = TestBed.inject(AuthService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should login a user', () => {
//     const mockResponse = { token: '12345' };

//     service.login('test@example.com', 'password123').subscribe(response => {
//       expect(response.token).toEqual('12345');
//     });

//     const req = httpMock.expectOne('http://localhost:8090/login');
//     expect(req.request.method).toBe('POST');
//     req.flush(mockResponse);
//   });

//   it('should logout a user', () => {
//     localStorage.setItem('jwt_token', '12345');
//     localStorage.setItem('userEmail', 'test@example.com');

//     service.logout();

//     expect(localStorage.getItem('jwt_token')).toBeNull();
//     expect(localStorage.getItem('userEmail')).toBeNull();
//   });
// });
