import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { ApiService } from '../../services/api.service';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, TableModule, ButtonModule,
    InputTextModule, DialogModule, ToastModule, TagModule, CheckboxModule,
    ConfirmDialogModule, HasPermissionDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  usuarios: any[] = [];
  dialogVisible = false;
  editando = false;
  
  usuarioForm = {
    id: 0,
    username: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  };
  
  // Solo permisos de usuario y grupo (sin tickets)
  permisosDisponibles = [
    { id: 1, nombre: 'user:view', seleccionado: false },
    { id: 2, nombre: 'user:add', seleccionado: false },
    { id: 3, nombre: 'user:edit', seleccionado: false },
    { id: 4, nombre: 'user:edit:profile', seleccionado: false },
    { id: 5, nombre: 'user:delete', seleccionado: false },
    { id: 6, nombre: 'user:manage', seleccionado: false },
    { id: 7, nombre: 'group:view', seleccionado: false },
    { id: 8, nombre: 'group:add', seleccionado: false },
    { id: 9, nombre: 'group:edit', seleccionado: false },
    { id: 10, nombre: 'group:delete', seleccionado: false },
    { id: 11, nombre: 'group:manage', seleccionado: false },
    { id: 20, nombre: 'group:add:member', seleccionado: false },
    { id: 21, nombre: 'group:delete:member', seleccionado: false },
    { id: 22, nombre: 'group:edit:config', seleccionado: false }
  ];
  
  permisosSeleccionados: number[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.getUsers().subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response); // 👈 Ver qué llega
      console.log('Primer usuario:', response.data[0]); // 👈 Ver campos
        if (response.statusCode === 200) {
          this.usuarios = response.data.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.nombre_completo,
            phone: user.telefono || '',
            address: user.direccion || '',
            permisos: user.permisos_globales || []
          }));
          console.log('Usuarios cargados:', this.usuarios);
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error(error)
    });
  }

  esSuperAdmin(permisos: number[]): boolean {
    return permisos?.includes(6);
  }

  getSuperAdmins() {
    return this.usuarios.filter(u => u.permisos?.includes(6)).length;
  }

  abrirNuevo() {
    this.editando = false;
    this.usuarioForm = { 
      id: 0, 
      username: '', 
      email: '', 
      fullName: '', 
      phone: '', 
      address: '',
      password: '', 
      confirmPassword: '' 
    };
    this.permisosSeleccionados = [];
    this.permisosDisponibles.forEach(p => p.seleccionado = false);
    this.dialogVisible = true;
  }

  editarUsuario(u: any) {
    console.log('Usuario a editar:', u);
    
    this.usuarioForm = { 
      id: u.id, 
      username: u.username, 
      email: u.email, 
      fullName: u.fullName,
      phone: u.phone || '',
      address: u.address || '',
      password: '',
      confirmPassword: ''
    };
    
    this.permisosSeleccionados = [...(u.permisos || [])];
    console.log('permisosSeleccionados:', this.permisosSeleccionados);
    
    // Actualizar checkboxes
    this.permisosDisponibles.forEach(p => {
      p.seleccionado = this.permisosSeleccionados.includes(p.id);
    });
    
    console.log('Permisos después de actualizar:', this.permisosDisponibles.map(p => ({ nombre: p.nombre, seleccionado: p.seleccionado })));
    
    this.editando = true;
    this.dialogVisible = true;
    
    // ✅ Forzar actualización de la vista
    this.cdr.detectChanges();
  }

  togglePermiso(permiso: any) {
    console.log('Toggle llamado para:', permiso.nombre, 'valor actual:', permiso.seleccionado);
    permiso.seleccionado = !permiso.seleccionado;
    
    if (permiso.seleccionado) {
      if (!this.permisosSeleccionados.includes(permiso.id)) {
        this.permisosSeleccionados.push(permiso.id);
      }
    } else {
      this.permisosSeleccionados = this.permisosSeleccionados.filter(id => id !== permiso.id);
    }
    
    console.log('permisosSeleccionados actualizados:', this.permisosSeleccionados);
  }

  guardar() {
    if (!this.usuarioForm.username || !this.usuarioForm.email || !this.usuarioForm.fullName) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos requeridos' });
      return;
    }
    
    if (!this.editando && this.usuarioForm.password !== this.usuarioForm.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
      return;
    }
    
    const userData = {
      nombre_completo: this.usuarioForm.fullName,
      username: this.usuarioForm.username,
      email: this.usuarioForm.email,
      direccion: this.usuarioForm.address || '',
      telefono: this.usuarioForm.phone || '',
      password: this.usuarioForm.password || ''
    };

    console.log('Permisos seleccionados:', this.permisosSeleccionados);
    
    if (!this.editando) {
      userData.password = this.usuarioForm.password;
    }
    
    if (this.editando) {
      // Actualizar usuario
      this.apiService.updateUser(this.usuarioForm.id, userData).subscribe({
        next: () => {
          // Actualizar permisos
          this.apiService.updateUserPermissions(this.usuarioForm.id, this.permisosSeleccionados).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
              this.cargarUsuarios();
              this.dialogVisible = false;
            },
            error: (err) => {
              console.error('Error al actualizar permisos:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar permisos' });
            }
          });
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar usuario' })
      });
    } else {
      // Crear nuevo usuario
      this.apiService.register(userData).subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            const nuevoId = response.data.id;
            // Asignar permisos
            this.apiService.updateUserPermissions(nuevoId, this.permisosSeleccionados).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado con permisos' });
                this.cargarUsuarios();
                this.dialogVisible = false;
              },
              error: (err) => {
                console.error('Error al asignar permisos:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario creado pero error al asignar permisos' });
              }
            });
          }
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear usuario' })
      });
    }
  }
  eliminarUsuario(u: any) {
    this.confirmationService.confirm({
      message: `¿Eliminar a ${u.fullName}?`,
      accept: () => {
        this.apiService.deleteUser(u.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
            this.cargarUsuarios();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar' })
        });
      }
    });
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}