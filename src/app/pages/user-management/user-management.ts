import { Component } from '@angular/core';
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
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, TableModule, ButtonModule,
    InputTextModule, DialogModule, ToastModule, TagModule, HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent {
  usuarios = [
    { id: 1, username: 'admin', email: 'admin@email.com', fullName: 'Administrador', rol: 'SuperAdmin' },
    { id: 2, username: 'editor', email: 'editor@email.com', fullName: 'Juan Editor', rol: 'Editor' },
    { id: 3, username: 'user1', email: 'user1@email.com', fullName: 'María Usuario', rol: 'Usuario' }
  ];

  dialogVisible = false;
  editando = false;
  usuarioForm = { id: 0, username: '', email: '', fullName: '', rol: 'Usuario' };

  constructor(private router: Router, private messageService: MessageService) {}

  getSuperAdmins() {
    return this.usuarios.filter(u => u.rol === 'SuperAdmin').length;
  }

  getEditores() {
    return this.usuarios.filter(u => u.rol === 'Editor').length;
  }

  getRolSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
  return estado === 'Activo' ? 'success' : 'danger';
}

  nuevoUsuario() {
    this.editando = false;
    this.usuarioForm = { id: 0, username: '', email: '', fullName: '', rol: 'Usuario' };
    this.dialogVisible = true;
  }

  editarUsuario(u: any) {
    this.editando = true;
    this.usuarioForm = { ...u };
    this.dialogVisible = true;
  }

  guardar() {
    if (!this.usuarioForm.username || !this.usuarioForm.email || !this.usuarioForm.fullName) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos' });
      return;
    }
    
    if (this.editando) {
      const index = this.usuarios.findIndex(u => u.id === this.usuarioForm.id);
      if (index !== -1) this.usuarios[index] = { ...this.usuarioForm };
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
    } else {
      const nuevoId = this.usuarios.length + 1;
      this.usuarios.push({ ...this.usuarioForm, id: nuevoId });
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado' });
    }
    this.dialogVisible = false;
  }

  eliminarUsuario(u: any) {
    this.usuarios = this.usuarios.filter(user => user.id !== u.id);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}