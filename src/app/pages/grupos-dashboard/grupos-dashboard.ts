import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { PermissionsService } from '../../services/permissions.service';


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
              , private cdr: ChangeDetectorRef,
              private permissionsSvc: PermissionsService
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


  // Agrega este método en la clase
  actualizarPermisosPorGrupo(grupoId: number) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const permisosMap: Record<number, string> = {
      1: 'user:view', 2: 'user:add', 3: 'user:edit', 4: 'user:edit:profile',
      5: 'user:delete', 6: 'user:manage', 7: 'group:view', 8: 'group:add',
      9: 'group:edit', 10: 'group:delete', 11: 'group:manage',
      12: 'tickets:view', 13: 'tickets:add', 14: 'tickets:edit', 15: 'tickets:delete',
      16: 'tickets:edit:state', 17: 'tickets:edit:comment', 18: 'tickets:manage',
      19: 'tickets:move', 20: 'group:add:member', 21: 'group:delete:member',
      22: 'group:edit:config', 23: 'tickets:move:own'
    };
    
    let permisos: string[] = [];
    
    // Permisos globales
    if (payload.globalPermissions) {
      permisos = payload.globalPermissions.map((id: number) => permisosMap[id]).filter(Boolean);
    }
    
    // Permisos específicos del grupo
    if (payload.permissionsByGroup && payload.permissionsByGroup[grupoId]) {
      const permisosGrupo = payload.permissionsByGroup[grupoId].permisos;
      if (permisosGrupo) {
        const permisosGrupoStrings = permisosGrupo.map((id: number) => permisosMap[id]).filter(Boolean);
        permisos = [...new Set([...permisos, ...permisosGrupoStrings])];
        console.log('Permisos del grupo añadidos:', permisosGrupoStrings);
      }
    }
    
    if (permisos.length === 0) {
      permisos = ['group:view', 'tickets:view'];
    }
    
    console.log('Permisos totales para grupo', grupoId, ':', permisos);
  }
  

  // Agregar después de grupos
  get totalTickets(): number {
    return this.grupos.reduce((sum, g) => sum + (g.ticketsCount || 0), 0);
  }

  get totalMiembros(): number {
    return this.grupos.reduce((sum, g) => sum + (g.integrantes || 0), 0);
  }

  // Modifica seleccionarGrupo:
  seleccionarGrupo(grupo: any) {
    localStorage.setItem('grupoSeleccionado', JSON.stringify(grupo));
    this.actualizarPermisosPorGrupo(grupo.id); // Agregar esta línea
    this.router.navigate(['/group-dashboard']);
  }
}