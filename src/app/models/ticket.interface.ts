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
  estado: 'Pendiente' | 'En Progreso' | 'Revisión' | 'Hecho' | 'Bloqueado';
  prioridad: 'Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Muy Baja';
  asignadoA: string;
  creadoPor: string;
  grupoId: number;
  fechaCreacion: Date;
  fechaLimite: Date;
  comentarios: Comentario[];
  historial: string[];
}