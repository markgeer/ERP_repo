import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, TableModule, ButtonModule,
    InputTextModule, TextareaModule, DialogModule, ToastModule, TagModule,
    HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './group-management.html',
  styleUrl: './group-management.css'
})
export class GroupManagementComponent implements OnInit {
  grupo = { id: 1, nombre: 'Equipo Dev', descripcion: 'Equipo de desarrollo' };
  editandoGrupo = false;
  
  usuarios = [
    { id: 1, username: 'admin', email: 'admin@email.com', fullName: 'Administrador', rol: 'admin' },
    { id: 2, username: 'editor', email: 'editor@email.com', fullName: 'Juan Editor', rol: 'editor' },
    { id: 3, username: 'colaborador1', email: 'colab1@email.com', fullName: 'María Colaboradora', rol: 'colaborador' }
  ];
  
  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Colaborador', value: 'colaborador' },
    { label: 'Visitante', value: 'visitante' }
  ];
  
  mostrarDialogAgregar = false;
  nuevoUsuarioEmail = '';
  nuevoUsuarioRol = 'colaborador';

  constructor(private router: Router, private messageService: MessageService) {}

  ngOnInit() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    if (grupoGuardado) {
      const data = JSON.parse(grupoGuardado);
      this.grupo = { ...this.grupo, ...data };
    }
  }

  abrirDialogAgregar() {
    this.nuevoUsuarioEmail = '';
    this.nuevoUsuarioRol = 'colaborador';
    this.mostrarDialogAgregar = true;
  }

  guardarGrupo() {
    if (!this.grupo.nombre) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es requerido' });
      return;
    }
    localStorage.setItem('grupoSeleccionado', JSON.stringify(this.grupo));
    this.editandoGrupo = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado' });
  }

  agregarUsuario() {
    if (!this.nuevoUsuarioEmail) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email requerido' });
      return;
    }
    if (this.usuarios.some(u => u.email === this.nuevoUsuarioEmail)) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Usuario ya existe' });
      return;
    }
    this.usuarios.push({
      id: this.usuarios.length + 1,
      username: this.nuevoUsuarioEmail.split('@')[0],
      email: this.nuevoUsuarioEmail,
      fullName: this.nuevoUsuarioEmail.split('@')[0],
      rol: this.nuevoUsuarioRol
    });
    this.mostrarDialogAgregar = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado' });
  }

  eliminarUsuario(u: any) {
    this.usuarios = this.usuarios.filter(us => us.id !== u.id);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
  }

  getRolSeverity(rol: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(rol) {
      case 'admin': return 'danger';
      case 'editor': return 'warn';
      case 'colaborador': return 'info';
      case 'visitante': return 'secondary';
      default: return 'secondary';
    }
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}