import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  homeOutline, peopleOutline, personCircleOutline, logOutOutline,
  mailOutline, callOutline, fingerPrintOutline, trashOutline, saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {

  // Referencia al <video #gallinaVideo> del HTML
  @ViewChild('gallinaVideo') gallinaVideo?: ElementRef<HTMLVideoElement>;

  introVisible = true;   // true = se ve la pantalla de la gallina
  flashing = false;      // true = destello blanco activo
  shaking = false;       // true = sacudida de pantalla activa
  needsTap = false;      // true = el navegador bloqueó el autoplay
  soundOn = false;       // el autoplay arranca en silencio

  constructor() {
    // Registramos aquí los íconos que usa la app, para que Ionic
    // no tenga que descargarlos como archivos .svg por separado.
    addIcons({
      homeOutline, peopleOutline, personCircleOutline, logOutOutline,
      mailOutline, callOutline, fingerPrintOutline, trashOutline, saveOutline
    });
  }

  ngAfterViewInit() {
    const video = this.gallinaVideo?.nativeElement;
    if (!video) return;

    // Los navegadores solo permiten autoplay si el video está en silencio.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay bloqueado (ej. modo ahorro de batería en iOS): pedimos un toque.
      this.needsTap = true;
    });
  }

  // Se llama cuando el video TERMINA: (ended)="onVideoEnded()"
  // También se llama si el video falla al cargar, para no dejar la app trabada.
  onVideoEnded() {
    if (!this.introVisible) return;   // evita que se dispare dos veces

    this.introVisible = false;        // 1) oculta la pantalla del video -> aparece el login
    this.flashing = true;             // 2) destello
    this.shaking = true;              // 3) sacudida de pantalla
    if ('vibrate' in navigator) navigator.vibrate([120, 60, 220]);  // 4) vibra el celular

    // Cuando acaban las animaciones, apagamos los efectos
    setTimeout(() => {
      this.flashing = false;
      this.shaking = false;
    }, 900);
  }

  // Botón "TOCA PARA INICIAR" (solo si el autoplay fue bloqueado)
  startByTap() {
    const video = this.gallinaVideo?.nativeElement;
    if (!video) return;
    video.muted = false;              // el toque cuenta como permiso: ya puede sonar
    this.soundOn = true;
    this.needsTap = false;
    video.play().catch(() => this.onVideoEnded());
  }

  // Botón de sonido
  toggleSound() {
    const video = this.gallinaVideo?.nativeElement;
    if (!video) return;
    video.muted = !video.muted;
    this.soundOn = !video.muted;
  }
}
