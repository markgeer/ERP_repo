import { Component, OnInit } from '@angular/core';
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

@Component({
  selector: 'app-home',
  imports: [
    CardModule, 
    ButtonModule, 
    TableModule, 
    TagModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  recentActivities: any[] = [];

  ngOnInit() {
    this.initRecentActivities();
  }

  initRecentActivities() {
    this.recentActivities = [
      { id: 1, action: 'Nuevo usuario registrado', user: 'Juan Pérez', date: '2024-03-01', status: 'Completado' },
      { id: 2, action: 'Pedido #1234 procesado', user: 'María García', date: '2024-03-01', status: 'Pendiente' },
      { id: 3, action: 'Actualización de perfil', user: 'Carlos López', date: '2024-02-29', status: 'Completado' },
      { id: 4, action: 'Nuevo comentario', user: 'Ana Martínez', date: '2024-02-29', status: 'En revisión' },
      { id: 5, action: 'Documento subido', user: 'Pedro Sánchez', date: '2024-02-28', status: 'Completado' }
    ];
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(status) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warn';
      case 'En revisión':
        return 'info';
      default:
        return 'secondary';
    }
  }
}