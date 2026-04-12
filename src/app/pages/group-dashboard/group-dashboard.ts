import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

interface Ticket {
  id: number;
  titulo: string;
  estado: string;
  prioridad: string;
  asignadoA: string;
  fechaCreacion: Date;
}

interface Mensaje {
  texto: string;
  esUsuario: boolean;
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
  
  // LLM (simulado)
  prompt: string = '';
  mensajes: Mensaje[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarGrupo();
    this.cargarMetricas();
    this.cargarTicketsRecientes();
    this.mensajeBienvenida();
  }

  cargarGrupo() {
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    if (grupoGuardado) {
      this.grupoSeleccionado = JSON.parse(grupoGuardado);
    } else {
      this.grupoSeleccionado = { nombre: 'Mi Grupo', id: 1 };
    }
  }

  cargarMetricas() {
    // Simulación de datos
    this.totalTickets = 12;
    this.ticketsPendientes = 5;
    this.ticketsProgreso = 4;
    this.ticketsCompletados = 3;
  }

  cargarTicketsRecientes() {
    this.ticketsRecientes = [
      { id: 1, titulo: 'Error en el login', estado: 'Pendiente', prioridad: 'Alta', asignadoA: 'admin', fechaCreacion: new Date('2024-03-01') },
      { id: 2, titulo: 'Mejorar rendimiento', estado: 'En Progreso', prioridad: 'Media', asignadoA: 'editor', fechaCreacion: new Date('2024-03-02') },
      { id: 3, titulo: 'Actualizar documentación', estado: 'Pendiente', prioridad: 'Baja', asignadoA: 'user1', fechaCreacion: new Date('2024-03-03') },
      { id: 4, titulo: 'Corregir estilos CSS', estado: 'Completado', prioridad: 'Media', asignadoA: 'admin', fechaCreacion: new Date('2024-03-04') }
    ];
  }

  mensajeBienvenida() {
    this.mensajes.push({
      texto: `¡Hola! Soy tu asistente IA. Puedo ayudarte a gestionar los tickets del grupo "${this.grupoSeleccionado?.nombre}". ¿Qué necesitas?`,
      esUsuario: false
    });
  }

  enviarPrompt() {
    if (!this.prompt.trim()) return;

    // Agregar mensaje del usuario
    this.mensajes.push({
      texto: this.prompt,
      esUsuario: true
    });

    // Simular respuesta del LLM
    setTimeout(() => {
      let respuesta = '';
      const promptLower = this.prompt.toLowerCase();
      
      if (promptLower.includes('ticket') || promptLower.includes('tickets')) {
        respuesta = `Tienes ${this.totalTickets} tickets en total. ${this.ticketsPendientes} pendientes, ${this.ticketsProgreso} en progreso y ${this.ticketsCompletados} completados.`;
      } else if (promptLower.includes('ayuda')) {
        respuesta = 'Puedo ayudarte con: ver resumen de tickets, buscar tickets por estado, o darte estadísticas del grupo.';
      } else {
        respuesta = `Entiendo tu consulta sobre "${this.prompt}". Puedes usar el tablero Kanban para gestionar los tickets visualmente.`;
      }
      
      this.mensajes.push({
        texto: respuesta,
        esUsuario: false
      });
    }, 500);

    this.prompt = '';
  }

  crearTicket() {
    this.router.navigate(['/ticket-create']);
  }

  verTicket(ticket: Ticket) {
    this.router.navigate(['/ticket', ticket.id]);
  }

  irAKanban() {
    this.router.navigate(['/kanban']);
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
  switch(estado) {
    case 'Pendiente': return 'warn';      // Cambiado de 'warning' a 'warn'
    case 'En Progreso': return 'info';
    case 'Completado': return 'success';
    default: return 'secondary';
  }
}

getPrioridadSeverity(prioridad: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
  switch(prioridad) {
    case 'Alta': return 'danger';
    case 'Media': return 'warn';           // Cambiado de 'warning' a 'warn'
    case 'Baja': return 'success';
    default: return 'info';
  }
  }
}