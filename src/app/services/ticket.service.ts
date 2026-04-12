import { Injectable, signal } from '@angular/core';

export interface Comentario {
  id: number;
  usuario: string;
  texto: string;
  fecha: Date;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho';
  prioridad: 'Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Muy Baja';
  asignadoA: string;
  creadoPor: string;
  grupoId: number;
  fechaCreacion: Date;
  fechaLimite: Date;
  comentarios: Comentario[];
  historial: string[];
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private tickets = signal<Ticket[]>(this.getTicketsMock());

  getTicketsByGrupo(grupoId: number): Ticket[] {
    return this.tickets().filter(t => t.grupoId === grupoId);
  }

  getTicketById(id: number): Ticket | undefined {
    return this.tickets().find(t => t.id === id);
  }

  getAllTickets(): Ticket[] {
    return this.tickets();
  }

  crearTicket(ticket: Omit<Ticket, 'id' | 'fechaCreacion' | 'comentarios' | 'historial'>): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: this.tickets().length + 1,
      fechaCreacion: new Date(),
      comentarios: [],
      historial: [`Ticket creado por ${ticket.creadoPor}`]
    };
    this.tickets.update(t => [...t, newTicket]);
    return newTicket;
  }

  actualizarTicket(id: number, updates: Partial<Ticket>): void {
    this.tickets.update(tickets =>
      tickets.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    );
  }

  actualizarEstado(ticketId: number, nuevoEstado: Ticket['estado'], usuario: string): void {
    this.tickets.update(tickets =>
      tickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              estado: nuevoEstado,
              historial: [...t.historial, `${usuario} cambió estado a ${nuevoEstado}`]
            }
          : t
      )
    );
  }

  agregarComentario(ticketId: number, comentario: string, usuario: string): void {
    this.tickets.update(tickets =>
      tickets.map(t =>
        t.id === ticketId
          ? {
              ...t,
              comentarios: [
                ...t.comentarios,
                { id: t.comentarios.length + 1, usuario, texto: comentario, fecha: new Date() }
              ],
              historial: [...t.historial, `${usuario} comentó: ${comentario}`]
            }
          : t
      )
    );
  }

  eliminarTicket(id: number): void {
    this.tickets.update(tickets => tickets.filter(t => t.id !== id));
  }

  private getTicketsMock(): Ticket[] {
    return [
      {
        id: 1,
        titulo: 'Error en el login',
        descripcion: 'Los usuarios no pueden iniciar sesión correctamente',
        estado: 'Pendiente',
        prioridad: 'Alta',
        asignadoA: 'admin',
        creadoPor: 'admin',
        grupoId: 1,
        fechaCreacion: new Date('2024-03-01'),
        fechaLimite: new Date('2024-03-10'),
        comentarios: [],
        historial: []
      },
      {
        id: 2,
        titulo: 'Mejorar rendimiento',
        descripcion: 'La página principal carga muy lento',
        estado: 'En Progreso',
        prioridad: 'Media',
        asignadoA: 'editor',
        creadoPor: 'admin',
        grupoId: 1,
        fechaCreacion: new Date('2024-03-02'),
        fechaLimite: new Date('2024-03-15'),
        comentarios: [],
        historial: []
      },
      {
        id: 3,
        titulo: 'Actualizar documentación',
        descripcion: 'Actualizar la documentación del API',
        estado: 'Pendiente',
        prioridad: 'Baja',
        asignadoA: 'user1',
        creadoPor: 'admin',
        grupoId: 1,
        fechaCreacion: new Date('2024-03-03'),
        fechaLimite: new Date('2024-03-20'),
        comentarios: [],
        historial: []
      }
    ];
  }
}