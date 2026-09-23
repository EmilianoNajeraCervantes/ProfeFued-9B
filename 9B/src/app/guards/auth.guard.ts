import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* =====================================================================
 * GUARD (guardia de rutas)
 * ---------------------------------------------------------------------
 * Se ejecuta ANTES de entrar a una ruta (ver app-routing.module.ts).
 * Si hay sesión -> deja pasar (true).
 * Si no hay sesión -> redirige al login.
 * Así nadie puede escribir /tabs/tab1 en la barra sin haber entrado.
 * ===================================================================== */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);   // inject() obtiene el servicio
  const router = inject(Router);

  return auth.haySesion() ? true : router.createUrlTree(['/login']);
};
