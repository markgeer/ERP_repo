import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Message } from "primeng/message";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    Card, 
    InputText, 
    Button, 
    Password, 
    FormsModule, 
    NgIf,
    Message
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Objeto para almacenar los datos del formulario
  loginData = {
    username: '',
    password: ''
  };

  // Variable para controlar el envío del formulario
  submitted = false;

  // Credenciales hardcodeadas (usuario y contraseña fijos)
  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = 'Admin123!';

  constructor(private router: Router) {}

  // Método para validar el formulario
  validateForm(): boolean {
    return this.loginData.username.trim() !== '' && 
           this.loginData.password.trim() !== '';
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    this.submitted = true;

    if (this.validateForm()) {
      // Validación de credenciales hardcodeadas
      if (this.loginData.username === this.VALID_USERNAME && 
          this.loginData.password === this.VALID_PASSWORD) {
        
        console.log('Login exitoso');
        // Mostrar mensaje de éxito
        alert('¡Login exitoso! Bienvenido al sistema');
        
        // Redireccionar al dashboard o página principal
        this.router.navigate(['/home']);
        
      } else {
        alert('Credenciales incorrectas. Usuario: admin, Contraseña: Admin123!');
      }
    }
  }

  // Método para verificar si un campo es inválido
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

  // Método para obtener el mensaje de error
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