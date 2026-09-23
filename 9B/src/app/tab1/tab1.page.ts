import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';

/* =====================================================================
 * TAB 1 · INICIO
 * Muestra los datos del usuario que inició sesión, cuántos usuarios
 * hay registrados y el botón para cerrar sesión.
 * ===================================================================== */
@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  // 📌 EXAMEN · P4/P5: "usuario" es un OBJETO del tipo de la INTERFAZ Usuario.
  // "| null" significa que puede estar vacío si no hay sesión.
  usuario: Usuario | null = null;
  totalUsuarios = 0;

  constructor(
    private auth: AuthService,
    private usuariosService: UsuariosService,
    private router: Router,
    private cdr: ChangeDetectorRef  // sirve para pedirle a Angular que redibuje la pantalla
  ) {}

  /* ===================================================================
   * ionViewWillEnter se ejecuta CADA vez que entras a esta pestaña,
   * así los datos siempre están actualizados.
   * 📌 EXAMEN · P3: aquí se manda a llamar la API (listar usuarios).
   * =================================================================== */
  async ionViewWillEnter() {
    this.usuario = this.auth.obtenerSesion();  // datos guardados al hacer login

    try {
      const lista = await this.usuariosService.listar();  // <- llamada a la API (GET)
      this.totalUsuarios = lista.length;
    } catch (error) {
      console.error(error);
    }

    // Esta app no usa zone.js, así que después de una petición asíncrona
    // hay que avisarle a Angular que actualice la pantalla.
    this.cdr.detectChanges();
  }

  // Borra la sesión y regresa al login
  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
