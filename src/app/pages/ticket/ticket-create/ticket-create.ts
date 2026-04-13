import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-ticket-create',
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
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css'
})
export class TicketCreateComponent implements OnInit {
  ticket = {
    titulo: '',
    descripcion: '',
    prioridad: 'Media' as const,
    asignadoA: null as string | null,
    fechaLimite: null as Date | null
  };

  prioridades = [
    { label: 'Muy Alta', value: 'Muy Alta' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
    { label: 'Muy Baja', value: 'Muy Baja' }
  ];

  usuarios: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.getUsers().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.usuarios = response.data.map((user: any) => ({
            label: user.nombre_completo || user.username,
            value: user.id
          }));
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  crearTicket() {
    if (!this.ticket.titulo.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El título es obligatorio' });
      return;
    }

    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupo = grupoGuardado ? JSON.parse(grupoGuardado) : { id: 1 };

    const prioridadMap: any = {
      'Muy Baja': 1,
      'Baja': 2,
      'Media': 3,
      'Alta': 4,
      'Muy Alta': 5
    };

    // Log para ver qué prioridad está seleccionada
    console.log('Prioridad seleccionada:', this.ticket.prioridad);
    console.log('Prioridad ID mapeado:', prioridadMap[this.ticket.prioridad]);

    // Log para ver qué usuario está seleccionado
    console.log('Asignado A (raw):', this.ticket.asignadoA);
    console.log('Asignado ID convertido:', this.ticket.asignadoA ? Number(this.ticket.asignadoA) : null);

    const ticketData = {
      grupo_id: Number(grupo.id),
      titulo: String(this.ticket.titulo),
      descripcion: String(this.ticket.descripcion || ''),
      prioridad_id: Number(prioridadMap[this.ticket.prioridad] || 3),
      fecha_limite: this.ticket.fechaLimite ? this.ticket.fechaLimite.toISOString().split('T')[0] : null,
      asignado_id: this.ticket.asignadoA ? Number(this.ticket.asignadoA) : null
    };

    console.log('Datos a enviar:', JSON.stringify(ticketData, null, 2));

    this.apiService.createTicket(ticketData).subscribe({
      next: (response) => {
        if (response.statusCode === 201) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket creado correctamente' });
          setTimeout(() => {
            this.router.navigate(['/ticket', response.data.id]);
          }, 1500);
        }
      },
      error: (error) => {
        console.error('Error detallado:', error);
        console.error('Error response body:', error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.data?.error || 'No se pudo crear el ticket' });
      }
    });
  }
  

  cancelar() {
    this.router.navigate(['/group-dashboard']);
  }
}