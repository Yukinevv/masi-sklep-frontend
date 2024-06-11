import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User } from '../modules/User';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * BehaviorSubject to store the user's email.
   * @type {BehaviorSubject<string | null>}
   */
  private userEmailSubject = new BehaviorSubject<string | null>(null);

  /**
   * Observable of the user's email.
   * @type {Observable<string | null>}
   */
  public userEmail = this.userEmailSubject.asObservable();

  /**
   * Base URL for the API.
   * @type {string}
   */
  private apiUrl = 'http://localhost:8090';

  /**
   * Creates an instance of AuthService.
   * Initializes userEmailSubject with stored email if available.
   *
   * @param {HttpClient} http - HTTP client to make requests.
   * @param {Router} router - Router to navigate between routes.
   */
  constructor(private http: HttpClient, private router: Router) {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      this.userEmailSubject.next(storedEmail);
    }
  }

  /**
   * Registers a new user.
   * Stores the user's email in local storage and updates userEmailSubject.
   *
   * @param {User} userData - The user data to register.
   * @returns {Observable<User>} Observable of the registered user.
   */
  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('userEmail', userData.email);
          this.userEmailSubject.next(userData.email);
        }
      })
    );
  }

  /**
   * Logs in a user.
   * Stores the JWT token and user's email in local storage and updates userEmailSubject.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Observable<LoginResponse>} Observable of the login response containing the JWT token.
   */
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

  /**
   * Logs out the user.
   * Removes the JWT token and user's email from local storage and updates userEmailSubject.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userEmail');
    this.userEmailSubject.next(null);
  }

  /**
   * Gets the user's email.
   *
   * @returns {string | null} The user's email or null if not available.
   */
  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  /**
   * Saves the JWT token in local storage.
   *
   * @param {string} token - The JWT token to save.
   */
  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Gets the JWT token from local storage.
   *
   * @returns {string | null} The JWT token or null if not available.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Decodes the JWT token and returns the payload.
   *
   * @returns {any} The decoded token payload or null if token is not available.
   */
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  /**
   * Checks if the user is an administrator.
   *
   * @returns {boolean} True if the user has admin role, false otherwise.
   */
  isAdmin(): boolean {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      console.log("role uzytkownika: " + decodedToken.roles)
      return decodedToken.roles == 'ROLE_ADMIN,ROLE_USER';
    }
    return false;
  }
}
