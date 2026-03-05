import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private keycloak: KeycloakService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return from(this.keycloak.getToken()).pipe(
            switchMap(token => {
                if (token) {
                    request = request.clone({
                        setHeaders: { Authorization: `Bearer ${token}` }
                    });
                }
                return next.handle(request);
            })
        );
    }
}
