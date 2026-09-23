import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastController } from '@ionic/angular/lazy';
import { AuthService, Usuario } from '../services/auth.service';
import { UsuariosService } from '../services/usuarios.service';

/* =====================================================================
 * TAB 3 · MI PERFIL
 * UPDATE: permite editar nombre, apellidos y teléfono (PATCH)
 * ===================================================================== */
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  // 📌 EXAMEN · P4/P5: objeto del tipo de la interfaz Usuario
  usuario: Usuario | null = null;

  // Copias editables conectadas a los inputs con [(ngModel)].
  // No se toca la sesión hasta que se guarda correctamente.
  nombre = '';
  apellidos = '';
  telefono = '';
  guardando = false;

  constructor(
    private auth: AuthService,
    private usuariosService: UsuariosService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  // Al entrar a la pestaña, llena el formulario con los datos de la sesión
  ionViewWillEnter() {
    this.usuario = this.auth.obtenerSesion();
    this.nombre = this.usuario?.nombre ?? '';      // ?? = si es null, usa ''
    this.apellidos = this.usuario?.apellidos ?? '';
    this.telefono = this.usuario?.telefono ?? '';
    this.cdr.detectChanges();
  }

  /* ===================================================================
   * 📌 EXAMEN · P3: AQUÍ SE MANDA A LLAMAR LA API (UPDATE / PATCH)
   * -------------------------------------------------------------------
   * Se arma un OBJETO "cambios" solo con los campos que el usuario
   * modificó, y se manda con PATCH (actualización parcial).
   * =================================================================== */
  async guardar() {
    if (!this.usuario) return;

    // 📌 EXAMEN · P5: objeto que empieza vacío {} y se le agregan propiedades
    const cambios: { nombre?: string; apellidos?: string; telefono?: string } = {};
    if (this.nombre !== this.usuario.nombre) cambios.nombre = this.nombre;
    if (this.apellidos !== this.usuario.apellidos) cambios.apellidos = this.apellidos;
    if (this.telefono !== (this.usuario.telefono ?? '')) cambios.telefono = this.telefono;

    if (Object.keys(cambios).length === 0) {
      this.mostrarToast('No hay cambios para guardar.', 'medium');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    try {
      const data = await this.usuariosService.actualizar(this.usuario.id, cambios);  // <- llamada a la API

      if (data.success) {
        // Actualizamos también la sesión guardada para que Inicio muestre lo nuevo
        this.usuario = { ...this.usuario, ...cambios };
        this.auth.guardarSesion(this.usuario);
        this.mostrarToast('Perfil actualizado.', 'success');
      } else {
        this.mostrarToast(data.message, 'danger');
      }
    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al conectar con el servidor.', 'danger');
    }

    this.guardando = false;
    this.cdr.detectChanges();
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, color, duration: 2000, position: 'top' });
    await toast.present();
  }
}
