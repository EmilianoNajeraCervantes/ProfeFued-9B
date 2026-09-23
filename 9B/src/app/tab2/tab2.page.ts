import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/lazy';
import { AuthService, Usuario } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';

/* =====================================================================
 * TAB 2 · USUARIOS
 * READ: muestra la lista de usuarios (GET)
 * DELETE: permite eliminar usuarios (DELETE)
 * Además tiene un buscador que filtra la lista en pantalla.
 * ===================================================================== */
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  // 📌 EXAMEN · P4/P5: arreglo de OBJETOS que cumplen la INTERFAZ Usuario
  usuarios: Usuario[] = [];
  busqueda = '';        // conectada al buscador con [(ngModel)]
  cargando = false;     // muestra/oculta el spinner
  miId: number | null = null;  // id del usuario con sesión (para no borrarse a sí mismo)

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthService,
    private alertCtrl: AlertController,   // ventanas de confirmación
    private toastCtrl: ToastController,   // mensajes pequeños arriba
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta cada vez que entras a la pestaña
  ionViewWillEnter() {
    this.miId = this.auth.obtenerSesion()?.id ?? null;
    this.cargar();
  }

  /* ===================================================================
   * 📌 EXAMEN · P3: AQUÍ SE MANDA A LLAMAR LA API (READ / GET)
   * También se usa al "jalar hacia abajo" para recargar (event).
   * =================================================================== */
  async cargar(event?: any) {
    this.cargando = true;
    this.cdr.detectChanges();

    try {
      this.usuarios = await this.usuariosService.listar();  // <- llamada a la API
    } catch (error) {
      console.error(error);
      this.mostrarToast('No se pudo conectar con el servidor. ¿XAMPP está encendido?', 'danger');
    }

    this.cargando = false;
    event?.target.complete(); // termina la animación de "jalar para recargar"
    this.cdr.detectChanges();
  }

  /* ===================================================================
   * Filtro en el FrontEnd: NO se vuelve a llamar a la API,
   * solo se filtra la lista que ya tenemos en memoria.
   * "get" = propiedad calculada; se usa en el HTML como usuariosFiltrados
   * =================================================================== */
  get usuariosFiltrados(): Usuario[] {
    const texto = this.busqueda.toLowerCase().trim();
    if (!texto) return this.usuarios;

    return this.usuarios.filter(u =>
      `${u.nombre} ${u.apellidos} ${u.email}`.toLowerCase().includes(texto)
    );
  }

  // Antes de borrar, pide confirmación con una alerta
  async confirmarEliminar(usuario: Usuario) {
    const alerta = await this.alertCtrl.create({
      header: 'Eliminar usuario',
      message: `¿Seguro que quieres eliminar a ${usuario.nombre} ${usuario.apellidos}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.eliminar(usuario) }
      ]
    });
    await alerta.present();
  }

  /* ===================================================================
   * 📌 EXAMEN · P3: AQUÍ SE MANDA A LLAMAR LA API (DELETE)
   * =================================================================== */
  async eliminar(usuario: Usuario) {
    try {
      const data = await this.usuariosService.eliminar(usuario.id);  // <- llamada a la API
      this.mostrarToast(data.message, data.success ? 'success' : 'danger');
      if (data.success) {
        await this.cargar();  // recarga la lista para que ya no aparezca
      }
    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al eliminar el usuario.', 'danger');
    }
  }

  // Mensaje corto que aparece arriba y se quita solo a los 2 segundos
  async mostrarToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, color, duration: 2000, position: 'top' });
    await toast.present();
  }
}
