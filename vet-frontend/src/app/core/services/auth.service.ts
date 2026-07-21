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

  constructor() {
    // Al inicializar la app (o recargar con F5), si hay un token válido, restauramos el branding
    this.restoreSessionBranding();
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        const token = response.token; 
        
        if (!token) {
           console.error('El backend no devolvió un token');
           return;
        }

        const decoded: any = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('orgId', decoded.orgId);

        // Aplicamos la identidad de marca
        this.branding.setIdentity(
          decoded.orgName || 'Veterinaria', 
          decoded.orgLogo || 'assets/logo.png', 
          decoded.orgColor || '#3b82f6'
        );
        
        console.log('Login exitoso. Org:', decoded.orgId);
      })
    );
  }

  /**
   * Elimina selectivamente las credenciales de sesión para no romper otras configs del localstorage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('orgId');
    this.branding.resetToDefault();
  }

  /**
   * Devuelve si hay un token almacenado (Útil para tus Route Guards)
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Opcional: Podrías validar aquí si el token no ha expirado
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp ? (decoded.exp * 1000) < Date.now() : false;
      
      if (isExpired) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Intenta leer el token existente al levantar la app para que no se pierdan los estilos al presionar F5
   */
  private restoreSessionBranding() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.branding.setIdentity(
          decoded.orgName || 'Veterinaria', 
          decoded.orgLogo || 'assets/logo.png', 
          decoded.orgColor || '#3b82f6'
        );
      } catch (e) {
        console.error('Error al restaurar sesión previa:', e);
        this.logout();
      }
    }
  }
}