import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from 'primeng/api';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-sidebar',
  imports: [Button, Avatar, Menu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  items: MenuItem[] = [];
  user: any = { name: 'Usuario', email: 'usuario@email.com' };

  constructor(
    private router: Router,
    private permissionsSvc: PermissionsService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
    this.generarMenu();
  }

  cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = {
        name: payload.username || 'Usuario',
        email: payload.email || 'usuario@email.com'
      };
      console.log('Usuario cargado:', this.user);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  }

  generarMenu() {
    const menuItems: MenuItem[] = [];

    // Dashboard - siempre visible
    menuItems.push({
      label: 'Grupos',
      icon: 'pi pi-home',
      routerLink: ['/grupos-dashboard']
    });

    // Gestion de Grupos
    if (this.permissionsSvc.hasAnyPermission(['group:view', 'group:add', 'group:edit', 'group:delete'])) {
      menuItems.push({
        label: 'Gestión de Grupos',
        icon: 'pi pi-cog',
        routerLink: ['/grupos']
      });
    }

    // Usuarios - solo SuperAdmin
    if (this.permissionsSvc.hasAnyPermission(['user:manage'])) {
      menuItems.push({
        label: 'Gestión de Usuarios',
        icon: 'pi pi-users',
        routerLink: ['/user-management']
      });
    }

    // Perfil - siempre visible
    menuItems.push({
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: ['/profile']
    });

    this.items = menuItems;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}