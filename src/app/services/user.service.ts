import { Injectable, signal } from '@angular/core';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  fullName: string;
  permisos: string[];
  estado: 'Activo' | 'Inactivo';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private usuarios = signal<Usuario[]>([
    { 
      id: 1, 
      username: 'admin', 
      email: 'admin@email.com', 
      fullName: 'Administrador',
      permisos: [
        'groups-view', 'groups-add', 'groups-edit', 'groups-delete',
        'users-view', 'users-add', 'users-edit', 'users-delete',
        'tickets-view', 'tickets-add', 'tickets-edit', 'tickets-delete'
      ],
      estado: 'Activo'
    },
    { 
      id: 2, 
      username: 'editor', 
      email: 'editor@email.com', 
      fullName: 'Juan Editor',
      permisos: ['groups-view', 'tickets-view', 'tickets-add', 'tickets-edit'],
      estado: 'Activo'
    },
    { 
      id: 3, 
      username: 'user1', 
      email: 'user1@email.com', 
      fullName: 'María Usuario',
      permisos: ['groups-view', 'tickets-view'],
      estado: 'Inactivo'
    }
  ]);

  getUsuarios(): Usuario[] {
    return this.usuarios();
  }

  getUsuarioById(id: number): Usuario | undefined {
    return this.usuarios().find(u => u.id === id);
  }

  crearUsuario(usuario: Omit<Usuario, 'id'>): Usuario {
    const nuevoId = this.usuarios().length + 1;
    const nuevoUsuario = { ...usuario, id: nuevoId };
    this.usuarios.update(u => [...u, nuevoUsuario]);
    return nuevoUsuario;
  }

  actualizarUsuario(id: number, data: Partial<Usuario>): void {
    this.usuarios.update(usuarios =>
      usuarios.map(u => u.id === id ? { ...u, ...data } : u)
    );
  }

  eliminarUsuario(id: number): void {
    this.usuarios.update(usuarios => usuarios.filter(u => u.id !== id));
  }
}