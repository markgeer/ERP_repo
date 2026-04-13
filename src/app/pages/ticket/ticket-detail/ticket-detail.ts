import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    DatePickerModule,
    TagModule,
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetailComponent implements OnInit {
  ticket: any = null;
  editando: boolean = false;
  nuevoComentario: string = '';
  usuarioActual: string = 'admin';

  estados = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Progreso', value: 'En Progreso' },
    { label: 'Revisión', value: 'Revisión' },
    { label: 'Hecho', value: 'Hecho' }
  ];

  prioridades = [
    { label: 'Muy Alta', value: 'Muy Alta' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
    { label: 'Muy Baja', value: 'Muy Baja' }
  ];

  usuarios = [
    { label: 'admin', value: 'admin' },
    { label: 'editor', value: 'editor' },
    { label: 'user1', value: 'user1' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTicket(id);
  }

  cargarTicket(id: number) {
    this.apiService.getTicket(id).subscribe({
      next: (response) => {
        console.log('Respuesta ticket:', response);
        if (response.statusCode === 200 && response.data) {
          this.ticket = response.data;
          // Normalizar datos para el HTML original
          this.ticket.estado = this.ticket.estados?.nombre || 'Pendiente';
          this.ticket.prioridad = this.ticket.prioridades?.nombre || 'Media';
          this.ticket.asignadoA = this.ticket.asignado?.username || 'Sin asignar';
          this.ticket.creadoPor = this.ticket.autor?.username || 'Desconocido';
          this.ticket.fechaCreacion = this.ticket.creado_en;
          this.ticket.fechaLimite = this.ticket.fecha_limite;
          
          // Inicializar arrays vacíos si no existen
          this.ticket.comentarios = this.ticket.comentarios || [];
          this.ticket.historial = this.ticket.historial || [];
          
          // Cargar comentarios e historial por separado
          this.cargarComentarios(id);
          this.cargarHistorial(id);
          
          this.cdr.detectChanges();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ticket no encontrado' });
          this.router.navigate(['/group-dashboard']);
        }
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar el ticket' });
        this.router.navigate(['/group-dashboard']);
      }
    });
  }

  cargarComentarios(id: number) {
    this.apiService.getTicketComments(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.ticket.comentarios = response.data.map((c: any) => ({
            usuario: c.autor?.username,
            fecha: c.creado_en,
            texto: c.contenido
          }));
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Error al cargar comentarios:', error)
    });
  }

  cargarHistorial(id: number) {
    this.apiService.getTicketHistory(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.ticket.historial = response.data.map((h: any) => 
            `${h.accion} - ${new Date(h.creado_en).toLocaleString()}`
          );
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Error al cargar historial:', error)
    });
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

  puedeEditar(): boolean {
    return this.ticket?.autor?.username === this.usuarioActual;
  }

  puedeCambiarEstado(): boolean {
    return this.ticket?.asignado?.username === this.usuarioActual || 
           this.ticket?.autor?.username === this.usuarioActual;
  }

  guardarCambios() {
    if (this.ticket) {
      const prioridadMap: any = {
        'Muy Baja': 1,
        'Baja': 2,
        'Media': 3,
        'Alta': 4,
        'Muy Alta': 5
      };
      
      const updateData = {
        titulo: this.ticket.titulo,
        descripcion: this.ticket.descripcion,
        prioridad_id: prioridadMap[this.ticket.prioridad] || 3,
        fecha_limite: this.ticket.fechaLimite ? new Date(this.ticket.fechaLimite).toISOString().split('T')[0] : null,
        asignado_id: this.ticket.asignadoA !== 'Sin asignar' ? this.ticket.asignadoA : null
      };
      
      this.apiService.updateTicket(this.ticket.id, updateData).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.editando = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket actualizado' });
            this.cargarTicket(this.ticket.id);
          }
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
        }
      });
    }
  }

  cambiarEstado(nuevoEstado: string) {
    if (this.ticket && this.puedeCambiarEstado()) {
      this.apiService.updateTicketStatus(this.ticket.id, nuevoEstado).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Estado cambiado a ${nuevoEstado}` });
            this.cargarTicket(this.ticket.id);
          }
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cambiar estado' });
        }
      });
    }
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim()) return;
    
    if (this.ticket) {
      this.apiService.addComment(this.ticket.id, this.nuevoComentario).subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            this.nuevoComentario = '';
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario agregado' });
            this.cargarTicket(this.ticket.id);
          }
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar comentario' });
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}