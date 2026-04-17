import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  asignadoA: string;
  estado_id: number;
  prioridad_id: number;
  creado_en: string;
  fecha_limite: string;
}

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
  
  usuarios: any[] = [{ label: 'Todos', value: '' }];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarTickets();
  }

  cargarUsuarios() {
    this.apiService.getUsers().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          const usuariosBackend = response.data.map((user: any) => ({
            label: user.nombre_completo || user.username,
            value: user.username
          }));
          this.usuarios = [{ label: 'Todos', value: '' }, ...usuariosBackend];
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  cargarTickets() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupo = grupoGuardado ? JSON.parse(grupoGuardado) : { id: 1 };

    this.apiService.getTickets(grupo.id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          // Mapear datos del backend al formato esperado
          this.tickets = response.data.map((t: any) => ({
            id: t.id,
            titulo: t.titulo,
            descripcion: t.descripcion,
            estado: t.estados?.nombre || 'Desconocido',
            prioridad: t.prioridades?.nombre || 'Media',
            asignadoA: t.asignado?.username || 'Sin asignar',
            creadoPor: t.autor?.username || 'Desconocido',  // ✅ Agregar
            estado_id: t.estado_id,
            prioridad_id: t.prioridad_id,
            creado_en: t.creado_en,
            fecha_limite: t.fecha_limite
          }));
          this.aplicarFiltros();
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
      }
    });
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
               (ticket.descripcion && ticket.descripcion.toLowerCase().includes(busquedaLower));
      }
      
      return true;
    });
    this.cdr.detectChanges();
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