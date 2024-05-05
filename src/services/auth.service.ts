import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  public userEmail = this.userEmailSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      this.userEmailSubject.next(storedEmail);
    }
  }

  private apiUrl = 'http://localhost:8090';

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);

          localStorage.setItem('userEmail', email);
          this.userEmailSubject.next(email);
        }
      })
    );
  }

  logout(): void {
    // Usuwanie tokena z localStorage
    localStorage.removeItem('jwt_token');

    localStorage.removeItem('userEmail');
    this.userEmailSubject.next(null);

    // this.router.navigate(['/login']);
  }

  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  // Zapisz token JWT w localStorage
  saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  // Pobierz token JWT z localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Dekoduj token JWT i zwróć payload
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  // Sprawdź, czy użytkownik jest administratorem
  isAdmin(): boolean {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      console.log("role uzytkownika: " + decodedToken.roles)
      return decodedToken.roles == 'ROLE_ADMIN,ROLE_USER' ? true : false;
    }
    return false;
  }
}
