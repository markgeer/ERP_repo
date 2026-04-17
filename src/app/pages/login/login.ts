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
            
            // Decodificar el token
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Permisos globales:', payload.globalPermissions);
            console.log('Permisos por grupo:', payload.permissionsByGroup);
            
            // Mapear IDs de permisos a strings
            const permisosMap: Record<number, string> = {
              1: 'user:view', 2: 'user:add', 3: 'user:edit', 4: 'user:edit:profile',
              5: 'user:delete', 6: 'user:manage', 7: 'group:view', 8: 'group:add',
              9: 'group:edit', 10: 'group:delete', 11: 'group:manage',
              12: 'tickets:view', 13: 'tickets:add', 14: 'tickets:edit', 15: 'tickets:delete',
              16: 'tickets:edit:state', 17: 'tickets:edit:comment', 18: 'tickets:manage',
              19: 'tickets:move', 20: 'group:add:member', 21: 'group:delete:member',
              22: 'group:edit:config', 23: 'tickets:move:own'
            };
            
            // ✅ SOLO permisos globales (sin permisos de grupo)
            let permisos: string[] = [];
            if (payload.globalPermissions && payload.globalPermissions.length > 0) {
              permisos = payload.globalPermissions.map((id: number) => permisosMap[id]).filter((p: string) => p);
            }

            if (permisos.length === 0) {
              permisos = ['group:view', 'tickets:view'];
            }

            console.log('Permisos globales asignados:', permisos);
            this.permissionsSvc.setPermissions(permisos);

            this.router.navigate(['/grupos-dashboard']);
          }
        },
        error: (error) => {
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