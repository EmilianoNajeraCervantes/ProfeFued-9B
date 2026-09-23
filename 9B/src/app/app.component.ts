import { Component } from '@angular/core';
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
export class AppComponent {
  constructor() {
    // Registramos aquí los íconos que usa la app, para que Ionic
    // no tenga que descargarlos como archivos .svg por separado.
    addIcons({
      homeOutline, peopleOutline, personCircleOutline, logOutOutline,
      mailOutline, callOutline, fingerPrintOutline, trashOutline, saveOutline
    });
  }
}
