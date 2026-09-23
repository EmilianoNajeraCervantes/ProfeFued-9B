import { Routes } from '@angular/router';

export const routes: Routes = [
  // PUNTO DE EXPOSICIÓN: 
  // 1. Configuramos la ruta raíz (path: '') para que redirija obligatoriamente a 'login'.
  // 2. Con esto cumplimos el requerimiento de hacer del login la vista inicial del app.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  }
];
