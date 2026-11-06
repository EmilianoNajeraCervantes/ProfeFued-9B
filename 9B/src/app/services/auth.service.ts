import { Injectable } from '@angular/core';
import axios from 'axios';

/* 
 * AUTH SERVICE 
 * Flujo completo:
 *   Pantalla (.html) -> Página (.ts) -> Servicio (.ts) -> API (.php) -> MySQL
 */

export const API_URL = 'http://localhost/ProfeFued/api';


/* INTERFACES DE USUARIO
 */
export interface Usuario {
  id: number;          // columna id (llave primaria, AUTO_INCREMENT)
  email: string;       // columna email
  nombre: string;      // columna nombre
  apellidos: string;   // columna apellidos
  telefono: string;    // columna telefono
}

// Interfaz para los datos que se mandan al REGISTRAR una cuenta
// No lleva "id" porque el id lo genera MySQL automáticamente
export interface NuevoUsuario {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono: string;
}

// Nombre con el que se guarda la sesión en el navegador (localStorage)
const CLAVE_SESION = 'profefued_usuario';


@Injectable({ providedIn: 'root' })  // providedIn: 'root' = una sola instancia para toda la app
export class AuthService {

  /* 
   *  AQUÍ SE CONSUME LA API (LOGIN)
   * axios.post(URL, objeto) hace una petición HTTP POST a login.php
   * y le manda el correo y la contraseña en formato JSON */
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login.php`, { email, password });

    // Si el login fue correcto, guardamos al usuario como sesión activa
    if (response.data.success) {
      this.guardarSesion(response.data.usuario);
    }
    return response.data;
  }

  /* AQUÍ SE CONSUME LA API (REGISTRO)
   * Recibe un objeto del tipo NuevoUsuario
   * y lo manda con POST a usuarios.php que hace el INSERT en MySQL */
  async registrar(datos: NuevoUsuario) {
    const response = await axios.post(`${API_URL}/usuarios.php`, datos);
    return response.data;
  }

  // MANEJO DE LA SESIÓN 
  // localStorage guarda texto en el navegador y no se borra al recargar.
  // JSON.stringify convierte el objeto a texto; JSON.parse lo regresa a objeto.

  guardarSesion(usuario: Usuario): void {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  }

  obtenerSesion(): Usuario | null {
    const datos = localStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  }

  haySesion(): boolean {
    return this.obtenerSesion() !== null;
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_SESION);
  }
}
