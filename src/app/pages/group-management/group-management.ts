import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { ApiService } from '../../services/api.service';

interface UsuarioGrupo {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  seleccionado: boolean;
}

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, TableModule, ButtonModule,
    InputTextModule, TextareaModule, DialogModule, ToastModule, TagModule,
    CheckboxModule, HasPermissionDirective
  ],
  providers: [MessageService],
  templateUrl: './group-management.html',
  styleUrl: './group-management.css'
})
export class GroupManagementComponent implements OnInit {
  categoriasAbiertas: any = {
    tickets: true,
    group: true
  };
  grupo = { id: 1, nombre: '', descripcion: '' };
  editandoGrupo = false;
  
  usuarios: UsuarioGrupo[] = [];
  
  // Lista de permisos disponibles
  permisosDisponibles: Permiso[] = [
    { id: 7, nombre: 'group:view', descripcion: 'Ver grupos', seleccionado: false },
    { id: 12, nombre: 'tickets:view', descripcion: 'Ver tickets', seleccionado: false },
    { id: 13, nombre: 'tickets:add', descripcion: 'Crear tickets', seleccionado: false },
    { id: 14, nombre: 'tickets:edit', descripcion: 'Editar tickets', seleccionado: false },
    { id: 16, nombre: 'tickets:edit:state', descripcion: 'Cambiar estado', seleccionado: false },
    { id: 17, nombre: 'tickets:edit:comment', descripcion: 'Comentar tickets', seleccionado: false },
    { id: 19, nombre: 'tickets:move', descripcion: 'Mover tickets', seleccionado: false },
    { id: 20, nombre: 'group:add:member', descripcion: 'Agregar miembros', seleccionado: false },
    { id: 21, nombre: 'group:delete:member', descripcion: 'Eliminar miembros', seleccionado: false },
    { id: 22, nombre: 'group:edit:config', descripcion: 'Editar grupo', seleccionado: false }
  ];
  
  mostrarDialogAgregar = false;
  nuevoUsuarioEmail = '';
  permisosSeleccionados: number[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarGrupo();
    this.cargarMiembros();
  }

  cargarGrupo() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    if (grupoGuardado) {
      const data = JSON.parse(grupoGuardado);
      this.grupo = { id: data.id, nombre: data.nombre, descripcion: data.descripcion || '' };
    }
  }

  cargarMiembros() {
    this.apiService.getGroupMembers(this.grupo.id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.usuarios = response.data.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.nombre_completo
          }));
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar miembros:', error);
      }
    });
  }

  abrirDialogAgregar() {
    this.nuevoUsuarioEmail = '';
    // this.permisosSeleccionados = [];
    this.permisosDisponibles.forEach(p => p.seleccionado = false);
    this.mostrarDialogAgregar = true;
  }

  togglePermiso(permiso: Permiso) {
    permiso.seleccionado = !permiso.seleccionado;
    // if (permiso.seleccionado) {
    //   this.permisosSeleccionados.push(permiso.id);
    // } else {
    //   this.permisosSeleccionados = this.permisosSeleccionados.filter(id => id !== permiso.id);
    // }
  }

  guardarGrupo() {
    if (!this.grupo.nombre) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es requerido' });
      return;
    }
    
    this.apiService.updateGroup(this.grupo.id, { nombre: this.grupo.nombre, descripcion: this.grupo.descripcion }).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          localStorage.setItem('grupoSeleccionado', JSON.stringify(this.grupo));
          this.editandoGrupo = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado' });
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al actualizar grupo:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar grupo' });
      }
    });
  }

  agregarUsuario() {
    if (!this.nuevoUsuarioEmail) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email requerido' });
      return;
    }

    // Mostrar el estado de cada permiso
    console.log('Estado de permisos:');
    this.permisosDisponibles.forEach(p => {
      console.log(`${p.nombre}: ${p.seleccionado}`);
    });
    
    // ✅ Calcular permisos seleccionados desde el array
    const permisosSeleccionados = this.permisosDisponibles
      .filter(p => p.seleccionado)
      .map(p => p.id);
    
    console.log('Permisos seleccionados:', permisosSeleccionados);
    
    if (permisosSeleccionados.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar al menos un permiso' });
      return;
    }
    
    console.log('Enviando email:', this.nuevoUsuarioEmail);
    
    this.apiService.addMember(this.grupo.id, this.nuevoUsuarioEmail, permisosSeleccionados).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response.statusCode === 201) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario agregado con permisos' });
          this.mostrarDialogAgregar = false;
          this.cargarMiembros();
        }
      },
      error: (error) => {
        console.error('Error al agregar usuario:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.data?.error || 'Error al agregar usuario' });
      }
    });
  }

  eliminarUsuario(usuario: UsuarioGrupo) {
    this.apiService.removeMember(this.grupo.id, usuario.id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${usuario.fullName} eliminado del grupo` });
          this.cargarMiembros();
        }
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario' });
      }
    });
  }

  getPermisosByCategoria(categoria: string): any[] {
    if (categoria === 'tickets') {
      return this.permisosDisponibles.filter(p => 
        p.nombre.startsWith('tickets:') || 
        p.nombre === 'tickets:view' || 
        p.nombre === 'tickets:add' ||
        p.nombre === 'tickets:edit' ||
        p.nombre === 'tickets:delete' ||
        p.nombre === 'tickets:move' ||
        p.nombre === 'tickets:edit:state' ||
        p.nombre === 'tickets:edit:comment'
      );
    } else {
      return this.permisosDisponibles.filter(p => 
        p.nombre.startsWith('group:') && 
        p.nombre !== 'group:view' &&
        p.nombre !== 'group:add' &&
        p.nombre !== 'group:edit' &&
        p.nombre !== 'group:delete'
      );
    }
  }

  get permisosTickets() {
    return this.permisosDisponibles.filter(p => 
      p.nombre.startsWith('tickets:') ||
      p.nombre === 'tickets:view' || p.nombre === 'tickets:add' ||
      p.nombre === 'tickets:edit' || p.nombre === 'tickets:delete' ||
      p.nombre === 'tickets:move' || p.nombre === 'tickets:edit:state' ||
      p.nombre === 'tickets:edit:comment'
    );
  }

  get permisosGrupo() {
    return this.permisosDisponibles.filter(p => 
      p.nombre.startsWith('group:') && 
      p.nombre !== 'group:view' && p.nombre !== 'group:add' &&
      p.nombre !== 'group:edit' && p.nombre !== 'group:delete'
    );
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  seleccionarTodos() {
    this.permisosDisponibles.forEach(p => p.seleccionado = true);
  }

  deseleccionarTodos() {
    this.permisosDisponibles.forEach(p => p.seleccionado = false);
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}