import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-grupos-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './grupos-dashboard.html',
  styleUrl: './grupos-dashboard.css'
})
export class GruposDashboardComponent implements OnInit {
  grupos: any[] = [];

  constructor(private router: Router,
              private apiService: ApiService
              , private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
  this.apiService.getGroups().subscribe({
    next: (response) => {
      console.log('Respuesta completa:', response);
      
      if (response.statusCode === 200) {
        // ✅ La respuesta ya viene como array directo de grupos
        this.grupos = response.data.map((grupo: any) => ({
          id: grupo.id,
          nombre: grupo.nombre,
          descripcion: grupo.descripcion || 'Sin descripción',
          ticketsCount: 0,
          integrantes: 0
        }));
        
        this.cargarDetallesGrupos();
      }
    },
    error: (error) => {
      console.error('Error al cargar grupos:', error);
    }
  });
}

  cargarDetallesGrupos() {
    let peticionesCompletadas = 0;
    const totalPeticiones = this.grupos.length * 2; // miembros + tickets por cada grupo
    
    this.grupos.forEach((grupo, index) => {
      // Cargar miembros del grupo
      this.apiService.getGroupMembers(grupo.id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.grupos[index].integrantes = response.data.length;
          }
          peticionesCompletadas++;
          if (peticionesCompletadas === totalPeticiones) {
            this.cdr.detectChanges(); // Forzar actualización al terminar
          }
        }
      });
      
      // Cargar tickets del grupo
      this.apiService.getTickets(grupo.id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.grupos[index].ticketsCount = response.data.length;
          }
          peticionesCompletadas++;
          if (peticionesCompletadas === totalPeticiones) {
            this.cdr.detectChanges(); // Forzar actualización al terminar
          }
        }
      });
    });
  }


  

  // Agregar después de grupos
  get totalTickets(): number {
    return this.grupos.reduce((sum, g) => sum + (g.ticketsCount || 0), 0);
  }

  get totalMiembros(): number {
    return this.grupos.reduce((sum, g) => sum + (g.integrantes || 0), 0);
  }

  seleccionarGrupo(grupo: any) {
    localStorage.setItem('grupoSeleccionado', JSON.stringify(grupo));
    this.router.navigate(['/group-dashboard']);
  }
}