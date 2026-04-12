import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
     // ✅ Directivas individuales, resolubles estáticamente
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

  constructor(
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.cargarTickets();
  }

  cargarTickets() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupo = grupoGuardado ? JSON.parse(grupoGuardado) : { id: 1 };
    const todosTickets = this.ticketService.getTicketsByGrupo(grupo.id);
    
    this.ticketsPendientes = todosTickets.filter(t => t.estado === 'Pendiente');
    this.ticketsProgreso = todosTickets.filter(t => t.estado === 'En Progreso');
    this.ticketsRevision = todosTickets.filter(t => t.estado === 'Revisión');
    this.ticketsHecho = todosTickets.filter(t => t.estado === 'Hecho');
  }

  onDrop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const ticketMovido = event.container.data[event.currentIndex];
      let nuevoEstado = '';
      
      if (event.container.id === 'pendiente') nuevoEstado = 'Pendiente';
      else if (event.container.id === 'progreso') nuevoEstado = 'En Progreso';
      else if (event.container.id === 'revision') nuevoEstado = 'Revisión';
      else if (event.container.id === 'hecho') nuevoEstado = 'Hecho';
      
      if (ticketMovido && nuevoEstado) {
        this.ticketService.actualizarEstado(ticketMovido.id, nuevoEstado as any, 'admin');
      }
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
      case 'Alta': return 'danger';
      case 'Media': return 'warn';
      case 'Baja': return 'info';
      case 'Muy Baja': return 'success';
      default: return 'secondary';
    }
  }
}