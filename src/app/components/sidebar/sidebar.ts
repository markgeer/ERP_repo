import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";
import { Menu } from "primeng/menu";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  imports: [Button, Avatar, Menu, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  items: MenuItem[];
  user: any;

  constructor(private router: Router) {
    this.user = {
      name: 'Usuario',
      email: 'usuario@email.com'
    };

    this.items = [
      {
        label: 'Dashcboard',
        icon: 'pi pi-home',
        routerLink: ['/home']
      },
      {
        label: 'tickets',
        icon: 'pi pi-user',
        routerLink: ['/profile']
      },
      {
        label: 'Grupos',
        icon: 'pi pi-cog',
        routerLink: ['/settings']
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: ['/profile']
      },
      {
        label: 'Ayuda',
        icon: 'pi pi-cog',
        routerLink: ['/settings']
      },
      // {
      //   separator: true
      // },
      // {
      //   label: 'Cerrar Sesión',
      //   icon: 'pi pi-sign-out',
      //   command: () => this.logout()
      // }
    ];
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}