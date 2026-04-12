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
import { SelectModule } from 'primeng/select';  // ✅ Agregar
import { MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
}

interface UsuarioGrupo {
  id: number;
  username: string;
  email: string;
  fullName: string;
  rol: string;
}

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
      SelectModule,  // ✅ Agregar
    ToastModule,
    TagModule,
    HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './group-management.html',
  styleUrl: './group-management.css'
})
export class GroupManagementComponent implements OnInit {
  // Datos del grupo
  grupo: Grupo = { id: 1, nombre: '', descripcion: '' };
  editandoGrupo: boolean = false;
  
  // Usuarios del grupo
  usuarios: UsuarioGrupo[] = [];
  
  // Agregar usuario
  mostrarDialogAgregar: boolean = false;
  nuevoUsuarioEmail: string = '';
  
  // Roles disponibles
  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Colaborador', value: 'colaborador' },
    { label: 'Visitante', value: 'visitante' }
  ];
  nuevoUsuarioRol: string = 'colaborador';

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarGrupo();
    this.cargarUsuarios();
  }

  cargarGrupo() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    if (grupoGuardado) {
      const grupoData = JSON.parse(grupoGuardado);
      this.grupo = { ...grupoData, descripcion: grupoData.descripcion || 'Sin descripción' };
    } else {
      this.grupo = { id: 1, nombre: 'Equipo Dev', descripcion: 'Equipo de desarrollo' };
    }
  }

  cargarUsuarios() {
    // Simular carga de usuarios del grupo
    this.usuarios = [
      { id: 1, username: 'admin', email: 'admin@email.com', fullName: 'Administrador', rol: 'admin' },
      { id: 2, username: 'editor', email: 'editor@email.com', fullName: 'Juan Editor', rol: 'editor' },
      { id: 3, username: 'colaborador1', email: 'colab1@email.com', fullName: 'María Colaboradora', rol: 'colaborador' },
      { id: 4, username: 'visitante1', email: 'visitante@email.com', fullName: 'Pedro Visitante', rol: 'visitante' }
    ];
  }

  guardarGrupo() {
    if (!this.grupo.nombre.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre del grupo es requerido' });
      return;
    }
    
    // Actualizar grupo en localStorage
    localStorage.setItem('grupoSeleccionado', JSON.stringify(this.grupo));
    
    this.editandoGrupo = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado correctamente' });
  }

  abrirDialogAgregar() {
    this.nuevoUsuarioEmail = '';
    this.nuevoUsuarioRol = 'colaborador';
    this.mostrarDialogAgregar = true;
  }

  agregarUsuario() {
    if (!this.nuevoUsuarioEmail.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El email es requerido' });
      return;
    }

    // Verificar si el usuario ya existe en el grupo
    const existe = this.usuarios.some(u => u.email === this.nuevoUsuarioEmail);
    if (existe) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El usuario ya está en el grupo' });
      return;
    }

    // Agregar nuevo usuario (simulado)
    const nuevoId = this.usuarios.length + 1;
    const nuevoUsuario: UsuarioGrupo = {
      id: nuevoId,
      username: this.nuevoUsuarioEmail.split('@')[0],
      email: this.nuevoUsuarioEmail,
      fullName: this.nuevoUsuarioEmail.split('@')[0],
      rol: this.nuevoUsuarioRol
    };
    
    this.usuarios.push(nuevoUsuario);
    this.mostrarDialogAgregar = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado al grupo' });
  }

  eliminarUsuario(usuario: UsuarioGrupo) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${usuario.fullName} eliminado del grupo` });
  }

  getRolSeverity(rol: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
  switch(rol) {
    case 'admin': return 'danger';
    case 'editor': return 'warn';
    case 'colaborador': return 'info';
    case 'visitante': return 'secondary';
    default: return 'info';
  }
}

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}