import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
// import { Message } from "primeng/message";
import { Router } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service'; // Agregar

@Component({
  selector: 'app-login',
  imports: [
    Card, 
    InputText, 
    Button, 
    Password, 
    FormsModule, 
    NgIf,
    // Message
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
  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = 'Admin123!';

  constructor(
    private router: Router,
    private permissionsSvc: PermissionsService  // Agregar
  ) {}

  validateForm(): boolean {
    return this.loginData.username.trim() !== '' && 
           this.loginData.password.trim() !== '';
  }

  onSubmit() {
    this.submitted = true;

    if (this.validateForm()) {
      if (this.loginData.username === this.VALID_USERNAME && 
          this.loginData.password === this.VALID_PASSWORD) {
        
        // Admin con todos los permisos
        this.permissionsSvc.setPermissions([
          'groups-view', 'groups-add', 'groups-edit', 'groups-delete',
          'group-add', 'group-edit', 'group-delete',
          'users-view', 'users-add', 'users-edit', 'users-delete',
          'tickets-view', 'tickets-add', 'tickets-edit', 'tickets-delete'
        ]);
        
        alert('¡Login exitoso! Bienvenido al sistema');
        this.router.navigate(['/grupos-dashboard']);
        
      } else if (this.loginData.username === 'editor' && this.loginData.password === 'Editor123!') {
      // Editor con permisos limitados - SOLO puede ver grupos
      this.permissionsSvc.setPermissions([
        'groups-view'
        // NO incluir 'users-view', 'tickets-view', etc.
      ]);
        
        alert('¡Login exitoso! Bienvenido editor');
        this.router.navigate(['/grupos-dashboard']);
        
      } else {
        alert('Credenciales incorrectas. Usuario: admin, Contraseña: Admin123!');
      }
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