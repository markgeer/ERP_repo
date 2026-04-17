import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { ApiService } from '../../services/api.service';

interface Grupo {
  id?: number;
  nombre: string;
  descripcion: string;
  creador_id?: number;
  creado_en?: string;
  miembros?: any[];
  tickets?: any[];
  integrantes?: number;
  ticketsCount?: number;
}

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    TableModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule,
    HasPermissionDirective, FormsModule, CardModule, ToolbarModule,
    ConfirmDialogModule, ToastModule, CommonModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {
  currentUserId: number = 0;
  grupos: Grupo[] = [];
  grupoSeleccionado: Grupo | null = null;
  grupoDialog: boolean = false;
  grupoDetalleDialog: boolean = false;
  grupo: Grupo = this.inicializarGrupo();
  submitted: boolean = false;
  miembrosDialog: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarGrupos();
  }

  inicializarGrupo(): Grupo {
    return {
      nombre: '',
      descripcion: ''
    };
  }

  cargarGrupos() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.userId;
    }
    
    this.apiService.getAllGroups().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.grupos = response.data.map((g: any) => ({
            id: g.id,
            nombre: g.nombre,
            descripcion: g.descripcion || '',
            creador_id: g.creador_id,
            creado_en: g.creado_en,
            integrantes: 0,
            ticketsCount: 0
          }));
          this.cargarDetallesGrupos();
          this.cdr.detectChanges();
        }
      }
    });
  }

  cargarDetallesGrupos() {
    this.grupos.forEach((grupo, index) => {
      this.apiService.getGroupMembers(grupo.id!).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.grupos[index].integrantes = response.data.length;
            this.cdr.detectChanges();
          }
        }
      });
      
      this.apiService.getTickets(grupo.id!).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.grupos[index].ticketsCount = response.data.length;
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  verDetalleGrupo(grupo: Grupo) {
    this.grupoSeleccionado = grupo;
    this.cargarMiembrosGrupo(grupo.id!);
    this.grupoDetalleDialog = true;
  }

  cargarMiembrosGrupo(grupoId: number) {
    this.apiService.getGroupMembers(grupoId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.miembrosDialog = response.data;
          this.cdr.detectChanges();
        }
      }
    });
  }

  abrirNuevo() {
    this.grupo = this.inicializarGrupo();
    this.submitted = false;
    this.grupoDialog = true;
  }

  editarGrupo(grupo: Grupo) {
    this.grupo = { ...grupo };
    this.grupoDialog = true;
  }

  eliminarGrupo(grupo: Grupo) {
    // Obtener el ID del usuario actual desde el token
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentUserId = payload.userId;
    
    // Verificar si el usuario actual es el creador del grupo
    if (grupo.creador_id !== currentUserId) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Sin permiso', 
        detail: 'Solo el creador del grupo puede eliminarlo' 
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar el grupo ' + grupo.nombre + '? Se eliminarán todos sus tickets y miembros.',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteGroup(grupo.id!).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this.grupos = this.grupos.filter(g => g.id !== grupo.id);
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo eliminado' });
              this.cdr.detectChanges();
            }
          },
          error: (error) => {
            console.error('Error al eliminar grupo:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el grupo' });
          }
        });
      }
    });
  }

  guardarGrupo() {
    this.submitted = true;

    if (!this.grupo.nombre?.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es requerido' });
      return;
    }

    if (this.grupo.id) {
      // Actualizar
      this.apiService.updateGroup(this.grupo.id, {
        nombre: this.grupo.nombre,
        descripcion: this.grupo.descripcion
      }).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            const index = this.grupos.findIndex(g => g.id === this.grupo.id);
            if (index !== -1) {
              this.grupos[index] = { ...this.grupos[index], ...this.grupo };
            }
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado' });
            this.grupoDialog = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error al actualizar grupo:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el grupo' });
        }
      });
    } else {
      // Crear nuevo grupo - el creador se asigna automáticamente como admin
      this.apiService.createGroup({
        nombre: this.grupo.nombre,
        descripcion: this.grupo.descripcion
      }).subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            const nuevoGrupo = response.data;
            this.grupos.push({
              id: nuevoGrupo.id,
              nombre: nuevoGrupo.nombre,
              descripcion: nuevoGrupo.descripcion || '',
              creador_id: nuevoGrupo.creador_id,
              creado_en: nuevoGrupo.creado_en,
              integrantes: 1, // El creador es miembro
              ticketsCount: 0
            });
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado. Eres el administrador del grupo.' });
            this.grupoDialog = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error al crear grupo:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el grupo' });
        }
      });
    }
    this.grupo = this.inicializarGrupo();
  }

  ocultarDialog() {
    this.grupoDialog = false;
    this.submitted = false;
  }

  get totalTickets(): number {
    return this.grupos.reduce((sum, g) => sum + (g.ticketsCount || 0), 0);
  }

  get totalMiembros(): number {
    return this.grupos.reduce((sum, g) => sum + (g.integrantes || 0), 0);
  }
}