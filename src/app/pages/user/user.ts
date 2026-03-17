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
    DatePickerModule
  ],
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {
  // Mismos campos que en Register
  userData = {
    username: 'jperez',
    email: 'juan.perez@email.com',
    password: '',
    confirmPassword: '',
    fullName: 'Juan Pérez',
    address: 'Calle Principal 123',
    phone: '5512345678',
    birthDate: new Date('1995-05-15')
  };

  editando: boolean = false;
  userBackup: any = {};

  constructor(private messageService: MessageService) {}

  editar() {
    this.userBackup = { ...this.userData };
    this.editando = true;
  }

  guardar() {
    this.editando = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario actualizado correctamente'
    });
  }

  cancelar() {
    this.userData = { ...this.userBackup };
    this.editando = false;
  }

  eliminar() {
    if (confirm('¿Eliminar usuario?')) {
      this.messageService.add({
        severity: 'info',
        summary: 'Eliminado',
        detail: 'Usuario eliminado (simulado)'
      });
    }
  }
}