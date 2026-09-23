import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_URL, Usuario } from './auth.service';

/* =====================================================================
 * USUARIOS SERVICE (servicio del CRUD de usuarios)
 * ---------------------------------------------------------------------
 * CRUD = Create, Read, Update, Delete (Crear, Leer, Actualizar, Borrar)
 * Cada operación usa un método HTTP distinto (arquitectura REST):
 *
 *   Operación   Método HTTP   Dónde está
 *   Crear       POST          AuthService.registrar()
 *   Leer        GET           listar()
 *   Actualizar  PATCH         actualizar()
 *   Borrar      DELETE        eliminar()
 *
 * Todas van al mismo archivo: api/usuarios.php, que revisa el método
 * con un switch y hace la consulta SQL correspondiente.
 * ===================================================================== */
@Injectable({ providedIn: 'root' })
export class UsuariosService {

  /* ===================================================================
   * 📌 EXAMEN · P6: AQUÍ SE CONSUME LA API (READ / GET)
   * Pide la lista de usuarios. PHP responde { success, data: [...] }.
   * Promise<Usuario[]> = regresa (más adelante) un arreglo de objetos
   * que cumplen la interfaz Usuario.
   * =================================================================== */
  async listar(): Promise<Usuario[]> {
    const response = await axios.get(`${API_URL}/usuarios.php`);
    return response.data.success ? response.data.data : [];
  }

  /* ===================================================================
   * 📌 EXAMEN · P6: AQUÍ SE CONSUME LA API (UPDATE / PATCH)
   * PATCH = actualización PARCIAL: solo se mandan los campos que
   * cambiaron. El "?" en cada propiedad significa que es opcional.
   * ...cambios (spread) copia las propiedades del objeto cambios
   * dentro del nuevo objeto { id, nombre, ... }.
   * =================================================================== */
  async actualizar(id: number, cambios: { nombre?: string; apellidos?: string; telefono?: string }) {
    const response = await axios.patch(`${API_URL}/usuarios.php`, { id, ...cambios });
    return response.data;
  }

  /* ===================================================================
   * 📌 EXAMEN · P6: AQUÍ SE CONSUME LA API (DELETE)
   * El id viaja en la URL: usuarios.php?id=5
   * =================================================================== */
  async eliminar(id: number) {
    const response = await axios.delete(`${API_URL}/usuarios.php`, { params: { id } });
    return response.data;
  }
}
