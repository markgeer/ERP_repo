import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TicketService, Ticket } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    SelectModule,
    InputTextModule
  ],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];
  
  // Filtros
  filtroEstado: string = '';
  filtroPrioridad: string = '';
  filtroAsignado: string = '';
  busqueda: string = '';
  
  // Opciones para filtros
  estados = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Progreso', value: 'En Progreso' },
    { label: 'Revisión', value: 'Revisión' },
    { label: 'Hecho', value: 'Hecho' }
  ];
  
  prioridades = [
    { label: 'Todos', value: '' },
    { label: 'Muy Alta', value: 'Muy Alta' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
    { label: 'Muy Baja', value: 'Muy Baja' }
  ];
  
  usuarios = [
    { label: 'Todos', value: '' },
    { label: 'admin', value: 'admin' },
    { label: 'editor', value: 'editor' },
    { label: 'user1', value: 'user1' }
  ];

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
    this.tickets = this.ticketService.getTicketsByGrupo(grupo.id);
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.ticketsFiltrados = this.tickets.filter(ticket => {
      // Filtro por estado
      if (this.filtroEstado && ticket.estado !== this.filtroEstado) return false;
      
      // Filtro por prioridad
      if (this.filtroPrioridad && ticket.prioridad !== this.filtroPrioridad) return false;
      
      // Filtro por asignado
      if (this.filtroAsignado && ticket.asignadoA !== this.filtroAsignado) return false;
      
      // Búsqueda por título o descripción
      if (this.busqueda) {
        const busquedaLower = this.busqueda.toLowerCase();
        return ticket.titulo.toLowerCase().includes(busquedaLower) ||
               ticket.descripcion.toLowerCase().includes(busquedaLower);
      }
      
      return true;
    });
  }

  limpiarFiltros() {
    this.filtroEstado = '';
    this.filtroPrioridad = '';
    this.filtroAsignado = '';
    this.busqueda = '';
    this.aplicarFiltros();
  }

  verTicket(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  crearTicket() {
    this.router.navigate(['/ticket-create']);
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(estado) {
      case 'Pendiente': return 'warn';
      case 'En Progreso': return 'info';
      case 'Revisión': return 'info';
      case 'Hecho': return 'success';
      default: return 'secondary';
    }
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

  getTicketsPorEstado(estado: string): number {
    return this.ticketsFiltrados.filter(t => t.estado === estado).length;
  }

  irAKanban() {
    this.router.navigate(['/kanban']);
  }

  irAGroupDashboard() {
    this.router.navigate(['/group-dashboard']);
  }
}