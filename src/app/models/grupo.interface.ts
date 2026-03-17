// models/grupo.interface.ts
export interface Grupo {
  id?: number;
  nivel: string;
  autor: string;
  nombre: string;
  integrantes: number;
  tickets: number;  // Hacentes posiblemente significa asistentes
  descripcion: string;
  fechaCreacion?: Date;
}