import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, CommonModule, FormsModule]
})
export class LoginPage implements AfterViewInit {

  email = '';
  password = '';
  nombre = '';
  apellidos = '';
  telefono = '';

  constructor(private el: ElementRef, private router: Router) { }

  // PUNTO DE EXPOSICIÓN:
  // 1. Método asíncrono para el Login.
  // 2. Usamos AXIOS para mandar la petición POST al API PHP (login.php).
  // 3. Manejamos promesas con try/catch para controlar errores de conexión.
  async doLogin() {
    if (!this.email || !this.password) {
      alert("Por favor ingresa email y contraseña");
      return;
    }

    try {
      const response = await axios.post('http://localhost/ProfeFued/api/login.php', {
        email: this.email,
        password: this.password
      });

      if (response.data.success) {
        alert("Bienvenido " + response.data.usuario.nombre);
        this.router.navigate(['/tabs/tab1']);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor PHP.");
    }
  }

  async doRegister() {
    if (!this.email || !this.password) {
      alert("Necesitas regresar al Paso 1 y colocar tu email y contraseña para crear la cuenta.");
      return;
    }

    try {
      const response = await axios.post('http://localhost/ProfeFued/api/usuarios.php', {
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        apellidos: this.apellidos,
        telefono: this.telefono
      });

      if (response.data.success) {
        alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
        // Podríamos redirigir o hacer login automático
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error al intentar registrar.");
    }
  }

  ngAfterViewInit() {
    const nextButtons = this.el.nativeElement.querySelectorAll('.next');
    const prevButtons = this.el.nativeElement.querySelectorAll('.previous');
    const fieldsets = this.el.nativeElement.querySelectorAll('fieldset');
    const progressbarLis = this.el.nativeElement.querySelectorAll('#progressbar li');

    let animating = false;

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

        const nextIndex = Array.from(fieldsets).indexOf(next_fs);
        if (progressbarLis[nextIndex]) {
          progressbarLis[nextIndex].classList.add('active');
        }

        next_fs.style.display = 'block';

        let start: number | null = null;
        const duration = 800;

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
