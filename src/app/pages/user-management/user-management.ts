import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';  // ✅ Agregar
import { HasPermissionDirective } from '../../directives/has-permission.directive';

interface Usuario {
  id: number;
  username: string;
  email: string;
  fullName: string;
  permisos: string[];
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    CheckboxModule,  // ✅ Agregar
    TagModule,
    HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  // Lista de usuarios
  usuarios: Usuario[] = [];
  
  // Diálogo de usuario
  mostrarDialogUsuario: boolean = false;
  usuarioEditando: Usuario | null = null;
  esNuevo: boolean = true;
  
  // Formulario de usuario
  formularioUsuario = {
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  };
  
  // Permisos disponibles
  permisosDisponibles = [
    { label: 'Grupos - Ver', value: 'groups-view', categoria: 'Grupos' },
    { label: 'Grupos - Crear', value: 'groups-add', categoria: 'Grupos' },
    { label: 'Grupos - Editar', value: 'groups-edit', categoria: 'Grupos' },
    { label: 'Grupos - Eliminar', value: 'groups-delete', categoria: 'Grupos' },
    { label: 'Usuarios - Ver', value: 'users-view', categoria: 'Usuarios' },
    { label: 'Usuarios - Crear', value: 'users-add', categoria: 'Usuarios' },
    { label: 'Usuarios - Editar', value: 'users-edit', categoria: 'Usuarios' },
    { label: 'Usuarios - Eliminar', value: 'users-delete', categoria: 'Usuarios' },
    { label: 'Tickets - Ver', value: 'tickets-view', categoria: 'Tickets' },
    { label: 'Tickets - Crear', value: 'tickets-add', categoria: 'Tickets' },
    { label: 'Tickets - Editar', value: 'tickets-edit', categoria: 'Tickets' },
    { label: 'Tickets - Eliminar', value: 'tickets-delete', categoria: 'Tickets' }
  ];
  
  permisosSeleccionados: string[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    // Simular carga de usuarios
    this.usuarios = [
      { 
        id: 1, 
        username: 'admin', 
        email: 'admin@email.com', 
        fullName: 'Administrador',
        permisos: this.permisosDisponibles.map(p => p.value),
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
    ];
  }

  abrirNuevoUsuario() {
    this.esNuevo = true;
    this.usuarioEditando = null;
    this.formularioUsuario = {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    };
    this.permisosSeleccionados = [];
    this.mostrarDialogUsuario = true;
  }

  editarUsuario(usuario: Usuario) {
    this.esNuevo = false;
    this.usuarioEditando = usuario;
    this.formularioUsuario = {
      username: usuario.username,
      email: usuario.email,
      fullName: usuario.fullName,
      password: '',
      confirmPassword: ''
    };
    this.permisosSeleccionados = [...usuario.permisos];
    this.mostrarDialogUsuario = true;
  }

  guardarUsuario() {
    // Validaciones
    if (!this.formularioUsuario.username.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario es requerido' });
      return;
    }
    if (!this.formularioUsuario.email.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email es requerido' });
      return;
    }
    if (!this.formularioUsuario.fullName.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nombre completo es requerido' });
      return;
    }
    
    if (this.esNuevo) {
      if (!this.formularioUsuario.password) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Contraseña es requerida' });
        return;
      }
      if (this.formularioUsuario.password !== this.formularioUsuario.confirmPassword) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
        return;
      }
      
      // Crear nuevo usuario
      const nuevoId = this.usuarios.length + 1;
      const nuevoUsuario: Usuario = {
        id: nuevoId,
        username: this.formularioUsuario.username,
        email: this.formularioUsuario.email,
        fullName: this.formularioUsuario.fullName,
        permisos: this.permisosSeleccionados,
        estado: 'Activo'
      };
      this.usuarios.push(nuevoUsuario);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
    } else {
      // Actualizar usuario existente
      if (this.usuarioEditando) {
        const index = this.usuarios.findIndex(u => u.id === this.usuarioEditando!.id);
        if (index !== -1) {
          this.usuarios[index] = {
            ...this.usuarios[index],
            username: this.formularioUsuario.username,
            email: this.formularioUsuario.email,
            fullName: this.formularioUsuario.fullName,
            permisos: this.permisosSeleccionados
          };
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
        }
      }
    }
    
    this.mostrarDialogUsuario = false;
  }

  eliminarUsuario(usuario: Usuario) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${usuario.fullName} eliminado` });
  }

  togglePermiso(permiso: string) {
    if (this.permisosSeleccionados.includes(permiso)) {
      this.permisosSeleccionados = this.permisosSeleccionados.filter(p => p !== permiso);
    } else {
      this.permisosSeleccionados.push(permiso);
    }
  }

  tienePermiso(permiso: string): boolean {
    return this.permisosSeleccionados.includes(permiso);
  }

  getPermisosPorCategoria(): any[] {
    const categorias: any = {};
    this.permisosDisponibles.forEach(p => {
      if (!categorias[p.categoria]) {
        categorias[p.categoria] = [];
      }
      categorias[p.categoria].push(p);
    });
    return Object.keys(categorias).map(categoria => ({
      nombre: categoria,
      permisos: categorias[categoria]
    }));
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    return estado === 'Activo' ? 'success' : 'danger';
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}