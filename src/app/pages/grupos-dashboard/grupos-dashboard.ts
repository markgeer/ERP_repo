import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-grupos-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './grupos-dashboard.html',
  styleUrl: './grupos-dashboard.css'
})
export class GruposDashboardComponent implements OnInit {
  grupos: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    // Datos de ejemplo - deberías obtenerlos de tu servicio real
    this.grupos = [
      { id: 1, nombre: 'Equipo Dev', descripcion: 'Equipo de desarrollo', ticketsCount: 5, integrantes: 4 },
      { id: 2, nombre: 'Soporte', descripcion: 'Equipo de soporte técnico', ticketsCount: 3, integrantes: 3 },
      { id: 3, nombre: 'UX Design', descripcion: 'Equipo de experiencia de usuario', ticketsCount: 2, integrantes: 2 }
    ];
  }

  seleccionarGrupo(grupo: any) {
    localStorage.setItem('grupoSeleccionado', JSON.stringify(grupo));
    this.router.navigate(['/group-dashboard']);
  }
}