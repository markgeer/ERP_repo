import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';

interface Ticket {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  asignadoA: string;
  fechaCreacion: Date;
}

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule
  ],
  templateUrl: './group-dashboard.html',
  styleUrl: './group-dashboard.css'
})
export class GroupDashboardComponent implements OnInit {
  grupoSeleccionado: any;
  
  // Métricas
  totalTickets: number = 0;
  ticketsPendientes: number = 0;
  ticketsProgreso: number = 0;
  ticketsCompletados: number = 0;
  
  // Tickets recientes
  ticketsRecientes: Ticket[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarGrupo();
  }

  cargarGrupo() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    if (grupoGuardado) {
      this.grupoSeleccionado = JSON.parse(grupoGuardado);
      this.cargarTickets();
    } else {
      this.grupoSeleccionado = { nombre: 'Mi Grupo', id: 1 };
      this.cargarTickets();
    }
  }

  cargarTickets() {
    this.apiService.getTickets(this.grupoSeleccionado.id).subscribe({
      next: (response) => {
        console.log('Respuesta:', response.data);
        
        if (response.statusCode === 200) {
          const tickets = response.data;
          
          if (!tickets || tickets.length === 0) {
            console.log('No hay tickets');
            return;
          }
          
          // Calcular métricas usando los objetos anidados
          this.totalTickets = tickets.length;
          this.ticketsPendientes = tickets.filter((t: any) => t.estados?.nombre === 'Pendiente').length;
          this.ticketsProgreso = tickets.filter((t: any) => t.estados?.nombre === 'En Progreso').length;
          this.ticketsCompletados = tickets.filter((t: any) => t.estados?.nombre === 'Hecho').length;
          
          this.ticketsRecientes = tickets.slice(0, 5).map((t: any) => ({
            id: t.id,
            titulo: t.titulo,
            estado: t.estados?.nombre || 'Desconocido',
            prioridad: t.prioridades?.nombre || 'Media',
            asignadoA: t.asignado?.username || 'Sin asignar',
            fechaCreacion: new Date(t.creado_en)
          }));
          console.log('ticketsRecientes:', this.ticketsRecientes); // 👈 Agrega esto

          
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
      }
    });
  }

getEstadoNombre(estadoId: number): string {
  const estadoMap: any = {
    1: 'Pendiente',
    2: 'En Progreso',
    3: 'Hecho',
    4: 'Cerrado'
  };
  return estadoMap[estadoId] || 'Desconocido';
}

  crearTicket() {
    this.router.navigate(['/ticket-create']);
  }

  verTicket(ticket: Ticket) {
  console.log('Haciendo clic en ticket:', ticket);
  console.log('Navegando a:', '/ticket', ticket.id);
  this.router.navigate(['/ticket', ticket.id]).then(success => {
    console.log('Navegación exitosa:', success);
  }).catch(err => {
    console.error('Error navegación:', err);
  });
}

  VerListaTicket() {
    this.router.navigate(['/tickets']);
  }

  Gestion() {
    this.router.navigate(['/group-management']);
  }

  irAKanban() {
    this.router.navigate(['/kanban']);
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(estado) {
      case 'Pendiente': return 'warn';
      case 'En Progreso': return 'info';
      case 'Completado': return 'success';
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
      default: return 'info';
    }
  }
}