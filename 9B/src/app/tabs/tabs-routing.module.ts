import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

/* =====================================================================
 * RUTAS DE LAS PESTAÑAS (hijas de /tabs)
 * ---------------------------------------------------------------------
 * path: '' porque "tabs" ya viene de app-routing.module.ts.
 * (Antes decía 'tabs' y la ruta quedaba /tabs/tabs/tab1, por eso
 *  después del login no se podía entrar a las pestañas.)
 *
 *   /tabs/tab1 -> Inicio
 *   /tabs/tab2 -> Usuarios (lista, buscar, eliminar)
 *   /tabs/tab3 -> Mi perfil (editar datos)
 * ===================================================================== */
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
