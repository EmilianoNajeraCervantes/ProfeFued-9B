import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/* =====================================================================
 * RUTAS PRINCIPALES DE LA APP
 * ---------------------------------------------------------------------
 * Aquí se define qué pantalla se muestra según la URL.
 *   /          -> redirige a /login
 *   /login     -> pantalla de login y registro
 *   /tabs/...  -> pestañas (Inicio, Usuarios, Mi perfil), protegidas
 *
 * loadChildren = "lazy loading": el código de cada pantalla se descarga
 * solo cuando el usuario entra a ella, así la app arranca más rápido.
 * ===================================================================== */
const routes: Routes = [
  // PUNTO DE EXPOSICIÓN:
  // 1. La ruta raíz (path: '') redirige a 'login', que es la vista inicial.
  // 2. Las tabs están protegidas con authGuard: solo entras si iniciaste sesión.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],   // <- revisa la sesión antes de entrar
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
