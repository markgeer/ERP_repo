import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';  // ✅ Agregar TextareaModule
import { SelectModule } from 'primeng/select';      // ✅ Cambiar a SelectModule
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker'; // ✅ Cambiar a DatePickerModule
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,      // ✅ Cambiado
    SelectModule,        // ✅ Cambiado
    ButtonModule,
    DatePickerModule,    // ✅ Cambiado
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css'
})
export class TicketCreateComponent {
  ticket = {
    titulo: '',
    descripcion: '',
    estado: 'Pendiente' as const,
    prioridad: 'Media' as const,
    asignadoA: '',
    fechaLimite: null as Date | null
  };

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
    private ticketService: TicketService,
    private router: Router,
    private messageService: MessageService
  ) {}

  crearTicket() {
    if (!this.ticket.titulo.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El título es obligatorio' });
      return;
    }

    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupo = grupoGuardado ? JSON.parse(grupoGuardado) : { id: 1 };

    const nuevoTicket = this.ticketService.crearTicket({
      ...this.ticket,
      creadoPor: 'admin',
      grupoId: grupo.id,
      fechaLimite: this.ticket.fechaLimite || new Date()
    });

    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket creado correctamente' });
    
    setTimeout(() => {
      this.router.navigate(['/ticket', nuevoTicket.id]);
    }, 1500);
  }

  cancelar() {
    this.router.navigate(['/group-dashboard']);
  }
}