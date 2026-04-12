import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from 'primeng/api';
// import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { PermissionsService } from '../../services/permissions.service'; // Agregar

@Component({
  selector: 'app-sidebar',
  imports: [Button, Avatar, Menu, ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit { // Cambiar a implements OnInit
  items: MenuItem[] = [];
  user: any;

  constructor(
    private router: Router,
    private permissionsSvc: PermissionsService // Agregar
  ) {
    this.user = {
      name: 'Usuario',
      email: 'usuario@email.com'
    };
  }

  ngOnInit() {
    this.generarMenu();
  }

  generarMenu() {
    const menuItems: MenuItem[] = [];

    // Dashboard - siempre visible
    menuItems.push({
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/home']
    });

    // Grupos - solo si tiene permiso groups-view
    if (this.permissionsSvc.hasAnyPermission(['groups-view'])) {
      menuItems.push({
        label: 'Grupos',
        icon: 'pi pi-users',
        routerLink: ['/grupos']
      });
    }

    // Usuarios - solo si tiene permiso users-view
    if (this.permissionsSvc.hasAnyPermission(['users-view'])) {
      menuItems.push({
        label: 'Usuarios',
        icon: 'pi pi-user',
        routerLink: ['/users']
      });
    }

    // Tickets - solo si tiene permiso tickets-view
    if (this.permissionsSvc.hasAnyPermission(['tickets-view'])) {
      menuItems.push({
        label: 'Tickets',
        icon: 'pi pi-ticket',
        routerLink: ['/tickets']
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
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}