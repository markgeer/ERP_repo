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
  submitted: boolean = false;
  maxDate: Date = new Date();

  private readonly SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PHONE_PATTERN = /^[0-9]{10}$/;
  private readonly NO_SPACES_EDGES_PATTERN = /^\S.*\S$/;

  constructor(private messageService: MessageService) {}

  isEmailValid(): boolean {
    const email = this.userData.email;
    return email !== '' && !email.includes(' ') && this.EMAIL_PATTERN.test(email);
  }

  onEmailInput() {
    this.userData.email = this.userData.email.replace(/\s/g, '');
  }

  isFullNameValid(): boolean {
    const fullName = this.userData.fullName;
    return fullName !== '' && this.NO_SPACES_EDGES_PATTERN.test(fullName);
  }

  isAddressValid(): boolean {
    const address = this.userData.address;
    return address !== '' && this.NO_SPACES_EDGES_PATTERN.test(address);
  }

  isPhoneValid(): boolean {
    const phone = this.userData.phone;
    return phone !== '' && !phone.includes(' ') && this.PHONE_PATTERN.test(phone);
  }

  isAgeValid(): boolean {
    if (!this.userData.birthDate) return false;
    const today = new Date();
    const birthDate = new Date(this.userData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  passwordValida(): boolean {
    return this.newPassword.length >= 10 && 
           this.SPECIAL_CHARS.test(this.newPassword) && 
           this.newPassword === this.confirmNewPassword;
  }

  formValido(): boolean {
    return this.isEmailValid() && 
           this.isFullNameValid() && 
           this.isAddressValid() && 
           this.isPhoneValid() && 
           this.isAgeValid();
  }

  getErrorMessage(fieldName: string): string {
    switch(fieldName) {
      case 'email':
        if (this.userData.email === '') return 'El email es requerido';
        if (this.userData.email.includes(' ')) return 'El email no puede contener espacios';
        return 'Ingrese un email válido';
      case 'fullName':
        if (this.userData.fullName === '') return 'El nombre completo es requerido';
        if (this.userData.fullName !== this.userData.fullName.trim()) return 'El nombre no puede tener espacios al inicio o final';
        return 'El nombre completo es requerido';
      case 'address':
        if (this.userData.address === '') return 'La dirección es requerida';
        if (this.userData.address !== this.userData.address.trim()) return 'La dirección no puede tener espacios al inicio o final';
        return 'La dirección es requerida';
      case 'phone':
        if (this.userData.phone === '') return 'El teléfono es requerido';
        if (this.userData.phone.includes(' ')) return 'El teléfono no puede contener espacios';
        if (!/^[0-9]+$/.test(this.userData.phone)) return 'El teléfono debe contener solo números';
        if (this.userData.phone.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos';
        return '';
      case 'birthDate':
        return 'Debe ser mayor de 18 años';
      default:
        return '';
    }
  }

  cambiarPassword() {
    this.cambiandoPassword = true;
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  guardarPassword() {
    if (this.passwordValida()) {
      this.cambiandoPassword = false;
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente' });
      alert('¡Contraseña actualizada correctamente!');
    }
  }

  cancelarCambioPassword() {
    this.cambiandoPassword = false;
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  editar() {
    this.userBackup = { ...this.userData };
    this.editando = true;
    this.submitted = false;
  }

  guardar() {
    this.submitted = true;
    if (this.formValido()) {
      this.editando = false;
      this.cambiandoPassword = false;
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.submitted = false;
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
      alert('¡Perfil actualizado correctamente!');
    }
  }

  cancelar() {
    this.userData = { ...this.userBackup };
    this.editando = false;
    this.cambiandoPassword = false;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.submitted = false;
  }

    // Agrega este método
  tieneSimboloEspecial(password: string): boolean {
    return /[!@#$%^&*]/.test(password);
  }

  eliminar() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cuenta eliminada',
        detail: 'Tu cuenta ha sido eliminada (simulado)'
      });
      alert('Cuenta eliminada (simulado)');
    }
  }
}