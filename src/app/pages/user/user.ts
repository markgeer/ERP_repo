import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    DatePickerModule,
    AvatarModule
  ],
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {
  userData = {
    username: 'jperez',
    email: 'juan.perez@email.com',
    fullName: 'Juan Pérez',
    address: 'Calle Principal 123',
    phone: '5512345678',
    birthDate: new Date('1995-05-15')
  };

  lastLogin = new Date('2024-03-17T14:54:00');
  editando: boolean = false;
  cambiandoPassword: boolean = false;
  newPassword: string = '';
  confirmNewPassword: string = '';
  userBackup: any = {};

  constructor(private messageService: MessageService) {}

  cambiarPassword() {
    this.cambiandoPassword = true;
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  passwordValida(): boolean {
    return this.newPassword.length >= 8 && 
           this.newPassword === this.confirmNewPassword;
  }

  guardarPassword() {
    if (this.passwordValida()) {
      this.cambiandoPassword = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Contraseña actualizada correctamente'
      });
    }
  }

  cancelarCambioPassword() {
    this.cambiandoPassword = false;
  }

  editar() {
    this.userBackup = { ...this.userData };
    this.editando = true;
  }

  guardar() {
    this.editando = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Perfil actualizado correctamente'
    });
  }

  cancelar() {
    this.userData = { ...this.userBackup };
    this.editando = false;
  }

  eliminar() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cuenta eliminada',
        detail: 'Tu cuenta ha sido eliminada (simulado)'
      });
    }
  }
}