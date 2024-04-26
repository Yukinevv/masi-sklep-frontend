// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Pobierz token z localStorage
        const authToken = localStorage.getItem('jwt_token');

        // Sklonuj żądanie i dodaj nagłówek z tokenem JWT
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });

        // Przekaż zmodyfikowane żądanie do następnego handlera w łańcuchu
        return next.handle(authReq);
    }
}
