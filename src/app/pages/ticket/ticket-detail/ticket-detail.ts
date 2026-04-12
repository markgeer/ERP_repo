import { Component, OnInit } from '@angular/core';
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
import { TicketService, Ticket } from '../../../services/ticket.service';

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
  ticket: Ticket | undefined;
  editando: boolean = false;
  nuevoComentario: string = '';
  usuarioActual: string = 'admin'; // Simulado, debería venir del login

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
    private ticketService: TicketService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ticket = this.ticketService.getTicketById(id);
    
    if (!this.ticket) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ticket no encontrado' });
      this.router.navigate(['/group-dashboard']);
    }
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
    // El creador puede editar todo
    return this.ticket?.creadoPor === this.usuarioActual;
  }

  puedeCambiarEstado(): boolean {
    // El asignado puede cambiar estado, el creador también
    return this.ticket?.asignadoA === this.usuarioActual || 
           this.ticket?.creadoPor === this.usuarioActual;
  }

  guardarCambios() {
    if (this.ticket) {
      this.ticketService.actualizarTicket(this.ticket.id, this.ticket);
      this.editando = false;
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket actualizado' });
    }
  }

  cambiarEstado(nuevoEstado: string) {
    if (this.ticket && this.puedeCambiarEstado()) {
      this.ticketService.actualizarEstado(this.ticket.id, nuevoEstado as any, this.usuarioActual);
      this.ticket = this.ticketService.getTicketById(this.ticket.id);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Estado cambiado a ${nuevoEstado}` });
    }
  }

  agregarComentario() {
    if (!this.nuevoComentario.trim()) return;
    
    if (this.ticket) {
      this.ticketService.agregarComentario(this.ticket.id, this.nuevoComentario, this.usuarioActual);
      this.ticket = this.ticketService.getTicketById(this.ticket.id);
      this.nuevoComentario = '';
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario agregado' });
    }
  }

  volver() {
    this.router.navigate(['/group-dashboard']);
  }
}