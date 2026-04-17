import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { PermissionsService } from '../../services/permissions.service';


// Interfaz basada en la respuesta real del backend
export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  autor_id: number;
  asignado_id: number | null;
  estado_id: number;
  prioridad_id: number;
  fecha_limite: string | null;
  creado_en: string;
  estados: { nombre: string; color: string };
  prioridades: { nombre: string; orden: number };
  autor: { id: number; username: string; nombre_completo: string };
  asignado: { id: number; username: string; nombre_completo: string } | null;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class KanbanComponent implements OnInit {
  ticketsPendientes: Ticket[] = [];
  ticketsProgreso: Ticket[] = [];
  ticketsRevision: Ticket[] = [];
  ticketsHecho: Ticket[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public permissionsSvc: PermissionsService
  ) {}

  ngOnInit() {
    this.cargarTickets();
  }

  cargarTickets() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupo = grupoGuardado ? JSON.parse(grupoGuardado) : { id: 1 };

    this.apiService.getTickets(grupo.id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          const todos: Ticket[] = response.data;
          this.ticketsPendientes = todos.filter(t => t.estados.nombre === 'Pendiente');
          this.ticketsProgreso   = todos.filter(t => t.estados.nombre === 'En Progreso');
          this.ticketsRevision   = todos.filter(t => t.estados.nombre === 'Revisión');
          this.ticketsHecho      = todos.filter(t => t.estados.nombre === 'Hecho');
          this.cargando = false;        //  Dentro del if
          this.cdr.detectChanges();     //  Dentro del if, después de asignar todo
        }
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.cargando = false;
        this.cdr.detectChanges();       //  También en error para quitar el spinner
      }
    });
  }

  onDrop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.cdr.detectChanges();
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.cdr.detectChanges();

    const ticketMovido = event.container.data[event.currentIndex];
    const estadoMap: Record<string, string> = {
      'pendiente': 'Pendiente',
      'progreso':  'En Progreso',
      'revision':  'Revisión',
      'hecho':     'Hecho'
    };
    const nuevoEstado = estadoMap[event.container.id];

    if (ticketMovido && nuevoEstado) {
      ticketMovido.estados = { ...ticketMovido.estados, nombre: nuevoEstado };

      this.apiService.updateTicketStatus(ticketMovido.id, nuevoEstado).subscribe({
        next: () => {
          // ✅ Recarga desde el backend para confirmar el estado real
          this.cargarTickets();
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          // ✅ Si falla, revierte recargando
          this.cargarTickets();
        }
      });
    }
  }

  verTicket(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  crearTicket() {
    this.router.navigate(['/ticket-create']);
  }

  volverDashboard() {
    this.router.navigate(['/group-dashboard']);
  }

  irALista() {
    this.router.navigate(['/tickets']);
  }

  getPrioridadSeverity(prioridad: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(prioridad) {
      case 'Muy Alta': return 'danger';
      case 'Alta':     return 'danger';
      case 'Media':    return 'warn';
      case 'Baja':     return 'info';
      case 'Muy Baja': return 'success';
      default:         return 'secondary';
    }
  }
}