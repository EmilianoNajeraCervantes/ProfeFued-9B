import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, NuevoUsuario } from '../services/auth.service';

/* =====================================================================
 * PÁGINA DE LOGIN (lógica de login.page.html)
 * ---------------------------------------------------------------------
 * Esta clase NO habla directo con PHP. Solo toma lo que el usuario
 * escribió y se lo pasa al AuthService (services/auth.service.ts).
 * ===================================================================== */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements AfterViewInit {

  // Variables conectadas a los inputs del HTML con [(ngModel)]
  email = '';
  password = '';
  nombre = '';
  apellidos = '';
  telefono = '';

  // Inyección de dependencias: Angular nos "entrega" estos objetos listos para usarse.
  // - el: acceso al HTML de esta página (para la animación de los pasos)
  // - router: para cambiar de pantalla
  // - auth: el servicio que consume la API
  constructor(private el: ElementRef, private router: Router, private auth: AuthService) { }

  /* ===================================================================
   * 📌 EXAMEN · P3: AQUÍ SE MANDA A LLAMAR LA API (LOGIN)
   * -------------------------------------------------------------------
   * 1. Se ejecuta con el botón Login: (click)="doLogin()".
   * 2. Valida que los campos no estén vacíos.
   * 3. Llama a this.auth.login(), que hace el axios.post a login.php.
   * 4. async/await + try/catch: esperamos la respuesta y atrapamos
   *    errores de conexión (por ejemplo, si XAMPP está apagado).
   * =================================================================== */
  async doLogin() {
    if (!this.email || !this.password) {
      alert("Por favor ingresa email y contraseña");
      return;
    }

    try {
      const data = await this.auth.login(this.email, this.password);  // <- llamada a la API

      if (data.success) {
        alert("Bienvenido " + data.usuario.nombre);
        // replaceUrl: true = que el botón "atrás" no regrese al login
        this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      } else {
        alert(data.message);  // ej. "Credenciales incorrectas"
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor PHP.");
    }
  }

  /* ===================================================================
   * 📌 EXAMEN · P3: AQUÍ SE MANDA A LLAMAR LA API (REGISTRO)
   * Se ejecuta con el botón Submit del paso 3: (click)="doRegister()".
   * =================================================================== */
  async doRegister() {
    if (!this.email || !this.password) {
      alert("Necesitas regresar al Paso 1 y colocar tu email y contraseña para crear la cuenta.");
      return;
    }

    /* =================================================================
     * 📌 EXAMEN · P5: EL OBJETO
     * -----------------------------------------------------------------
     * "nuevoUsuario" es un OBJETO: un conjunto de datos con la forma
     * { propiedad: valor }. Es de tipo NuevoUsuario (la INTERFAZ que
     * está en auth.service.ts), así que TypeScript revisa que tenga
     * todas las propiedades y con el tipo correcto.
     * Este objeto es el que se manda a la API convertido en JSON.
     * ================================================================= */
    const nuevoUsuario: NuevoUsuario = {
      email: this.email,
      password: this.password,
      nombre: this.nombre,
      apellidos: this.apellidos,
      telefono: this.telefono
    };

    try {
      const data = await this.auth.registrar(nuevoUsuario);  // <- llamada a la API

      if (data.success) {
        alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
        window.location.reload();  // recarga para volver al paso 1
      } else {
        alert(data.message);  // ej. "El correo ya está registrado"
      }
    } catch (error) {
      console.error(error);
      alert("Error al intentar registrar.");
    }
  }

  // Ciclo de vida de Ionic: se ejecuta cada vez que se va a mostrar esta pantalla.
  // Si ya había sesión iniciada, no tiene caso mostrar el login otra vez.
  ionViewWillEnter() {
    if (this.auth.haySesion()) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }
  }

  /* ===================================================================
   * ANIMACIÓN DEL FORMULARIO DE 3 PASOS (solo diseño, no toca la API)
   * -------------------------------------------------------------------
   * ngAfterViewInit se ejecuta cuando el HTML ya está dibujado.
   * Busca los botones .next y .previous y les agrega un evento click
   * que oculta el paso actual y muestra el siguiente/anterior con
   * una animación (requestAnimationFrame = un cuadro de animación).
   * =================================================================== */
  ngAfterViewInit() {
    const nextButtons = this.el.nativeElement.querySelectorAll('.next');
    const prevButtons = this.el.nativeElement.querySelectorAll('.previous');
    const fieldsets = this.el.nativeElement.querySelectorAll('fieldset');
    const progressbarLis = this.el.nativeElement.querySelectorAll('#progressbar li');

    let animating = false;  // evita que se encimen dos animaciones

    // ---------- Botón "Next": avanzar al siguiente paso ----------
    nextButtons.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', (e: Event) => {
        if (animating) return;
        animating = true;

        const current_fs = (e.target as HTMLElement).parentElement;
        if (!current_fs) {
          animating = false;
          return;
        }
        const next_fs = current_fs.nextElementSibling as HTMLElement;

        if (!next_fs || next_fs.tagName !== 'FIELDSET') {
          animating = false;
          return;
        }

        // Marca el siguiente paso como activo en la barra de progreso
        const nextIndex = Array.from(fieldsets).indexOf(next_fs);
        if (progressbarLis[nextIndex]) {
          progressbarLis[nextIndex].classList.add('active');
        }

        next_fs.style.display = 'block';

        let start: number | null = null;
        const duration = 800;  // milisegundos

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const now = 1 - progress;

          const scale = 1 - (1 - now) * 0.2;
          const left = (now * 50) + '%';
          const opacity = 1 - now;

          current_fs.style.transform = `scale(${scale})`;
          current_fs.style.position = 'absolute';

          next_fs.style.left = left;
          next_fs.style.opacity = opacity.toString();

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            current_fs.style.display = 'none';
            animating = false;
          }
        };
        window.requestAnimationFrame(step);
      });
    });

    // ---------- Botón "Previous": regresar al paso anterior ----------
    prevButtons.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', (e: Event) => {
        if (animating) return;
        animating = true;

        const current_fs = (e.target as HTMLElement).parentElement;
        if (!current_fs) {
          animating = false;
          return;
        }
        const previous_fs = current_fs.previousElementSibling as HTMLElement;

        if (!previous_fs || previous_fs.tagName !== 'FIELDSET') {
          animating = false;
          return;
        }

        // Quita el "activo" del paso actual en la barra de progreso
        const currentIndex = Array.from(fieldsets).indexOf(current_fs);
        if (progressbarLis[currentIndex]) {
          progressbarLis[currentIndex].classList.remove('active');
        }

        previous_fs.style.display = 'block';

        let start: number | null = null;
        const duration = 800;

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const now = 1 - progress;

          const scale = 0.8 + (1 - now) * 0.2;
          const left = ((1 - now) * 50) + '%';
          const opacity = 1 - now;

          current_fs.style.left = left;
          previous_fs.style.transform = `scale(${scale})`;
          previous_fs.style.opacity = opacity.toString();

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            current_fs.style.display = 'none';
            animating = false;
          }
        };
        window.requestAnimationFrame(step);
      });
    });
  }
}
