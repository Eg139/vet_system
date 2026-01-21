import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { BrandingService } from './branding.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private branding = inject(BrandingService);

  private readonly API_URL = 'http://localhost:3000';

login(credentials: any) {
    // Usamos la URL completa apuntando al puerto 3000
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        // IMPORTANTE: Tu NestJS devuelve el token en la propiedad 'token', no 'accessToken'
        const token = response.token; 
        
        if (!token) {
           console.error('El backend no devolvió un token');
           return;
        }

        const decoded: any = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('orgId', decoded.orgId);

        // US de Branding: Ahora usamos los datos REALES del token
        this.branding.setIdentity(
          decoded.orgName || 'Veterinaria', 
          decoded.orgLogo || 'assets/logo.png', 
          decoded.orgColor || '#3b82f6'
        );
        
        console.log('Login exitoso. Org:', decoded.orgId);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.branding.resetToDefault();
    // Aquí redirigirías al login
  }
}