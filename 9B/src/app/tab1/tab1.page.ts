import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  username = '';
  password = '';

  usernameFocused = false;
  passwordFocused = false;

  isTesting = false;
  isMoved = false;

  showAuthenticating = false;
  showLoginContent = true;
  showSuccess = false;

  isAnimating = false;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {}

  login(): void {
    // Evita que se inicie varias veces al presionar rápidamente.
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;
    this.showSuccess = false;

    // Inclinar el formulario.
    this.isTesting = true;

    setTimeout(() => {
      // Mover el formulario hacia la izquierda.
      this.isMoved = true;
      this.changeDetector.detectChanges();
    }, 300);

    setTimeout(() => {
      // Mostrar "Authenticating...".
      this.showAuthenticating = true;
      this.changeDetector.detectChanges();
    }, 500);

    setTimeout(() => {
      // Ocultar "Authenticating..." y regresar el formulario.
      this.showAuthenticating = false;
      this.isMoved = false;
      this.changeDetector.detectChanges();
    }, 2500);

    setTimeout(() => {
      // Quitar el formulario de acceso.
      this.isTesting = false;
      this.showLoginContent = false;
      this.changeDetector.detectChanges();
    }, 2800);

    setTimeout(() => {
      // Mostrar el mensaje final.
      this.showSuccess = true;
      this.isAnimating = false;
      this.changeDetector.detectChanges();
    }, 3200);
  }
}