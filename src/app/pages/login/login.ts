import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-login',
  imports: [
    Card, 
    InputText, 
    Button, 
    Password, 
    FormsModule, 
    NgIf,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    username: '',
    password: ''
  };

  submitted = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private permissionsSvc: PermissionsService
  ) {}

  validateForm(): boolean {
    return this.loginData.username.trim() !== '' && 
           this.loginData.password.trim() !== '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.validateForm()) {
      this.apiService.login({
        username: this.loginData.username,
        password: this.loginData.password
      }).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            const token = response.data.token;
            const user = response.data.user;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Decodificar el token para obtener los permisos
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token decodificado:', payload);
            
            // Extraer permisos del token
            let permisos: string[] = [];
            
            // Permisos globales del usuario
            if (payload.globalPermissions) {
              // Aquí mapeas los IDs de permisos a strings
              // Por ahora, asignamos según el username
              if (user.username === 'admin') {
                permisos = [
                  'groups-view', 'groups-add', 'groups-edit', 'groups-delete',
                  'users-view', 'users-add', 'users-edit', 'users-delete',
                  'tickets-view', 'tickets-add', 'tickets-edit', 'tickets-delete',
                  'group-add', 'group-edit', 'group-delete'
                ];
              } else {
                permisos = ['groups-view', 'tickets-view'];
              }
            }
            
            this.permissionsSvc.setPermissions(permisos);
            
            this.router.navigate(['/grupos-dashboard']);
          }
        },
        error: (error) => {
          console.error(error);
          alert('Credenciales incorrectas');
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.submitted) return false;
    switch(fieldName) {
      case 'username':
        return this.loginData.username.trim() === '';
      case 'password':
        return this.loginData.password.trim() === '';
      default:
        return false;
    }
  }

  getErrorMessage(fieldName: string): string {
    if (!this.submitted) return '';
    switch(fieldName) {
      case 'username':
        return 'El usuario es requerido';
      case 'password':
        return 'La contraseña es requerida';
      default:
        return '';
    }
  }
}