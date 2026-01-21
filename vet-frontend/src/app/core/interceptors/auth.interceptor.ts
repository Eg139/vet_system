import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos obtener las credenciales del almacenamiento local
  const token = localStorage.getItem('token');
  const orgId = localStorage.getItem('orgId');

  // 2. Clonamos la petición para añadir las cabeceras
  // Recordatorio: las peticiones en Angular son inmutables, por eso usamos .clone()
  let authReq = req;

  if (token || orgId) {
    authReq = req.clone({
      setHeaders: {
        // Añadimos el Token para la autenticación
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Añadimos el ID de organización para el filtrado en Base de Datos (SaaS)
        ...(orgId ? { 'x-org-id': orgId } : {})
      }
    });
  }

  // 3. Pasamos la petición (modificada o no) al siguiente paso
  return next(authReq);
};