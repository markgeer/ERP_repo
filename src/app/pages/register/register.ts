import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from "primeng/inputnumber";
import { Message } from "primeng/message";

@Component({
  selector: 'app-register',
  imports: [
    Card,
    InputText,
    Button,
    Password,
    FormsModule,
    NgIf,
    DatePickerModule,
    InputNumber,
    Message
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Objeto para almacenar los datos del registro
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    address: '',
    phone: '',
    birthDate: null as Date | null
  };

  // // Variable para controlar el envío del formulario
  // submitted = false;

  // // Símbolos especiales requeridos
  // private readonly SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  // // Validar email
  // private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // // Validar teléfono (solo números)
  // private readonly PHONE_PATTERN = /^[0-9]{10}$/;

  // // Patrón para validar que no haya espacios al inicio o final
  // private readonly NO_SPACES_EDGES_PATTERN = /^\S.*\S$/;

  // // Fecha máxima (para que no seleccionen fechas futuras)
  // maxDate: Date = new Date();

  // // Método para limpiar espacios al inicio y final de un texto
  // private trimValue(value: string): string {
  //   return value ? value.trim() : '';
  // }

  // Método para validar el formulario completo
  // validateForm(): boolean {
  //   return this.isUsernameValid() &&
  //          this.isEmailValid() &&
  //          this.isPasswordValid() &&
  //          this.isConfirmPasswordValid() &&
  //          this.isFullNameValid() &&
  //          this.isAddressValid() &&
  //          this.isPhoneValid() &&
  //          this.isAgeValid();
  // }

  // // Validaciones individuales
  // isUsernameValid(): boolean {
  //   const username = this.registerData.username;
  //   // Verifica que no esté vacío y que no tenga espacios al inicio o final
  //   return username !== '' && 
  //          this.NO_SPACES_EDGES_PATTERN.test(username) &&
  //          username.trim() !== '';
  // }

  // isEmailValid(): boolean {
  //   const email = this.registerData.email;
  //   // Verifica que no esté vacío, no tenga espacios y cumpla el patrón
  //   return email !== '' && 
  //         !email.includes(' ') &&  // Verifica que no tenga NINGÚN espacio
  //         this.EMAIL_PATTERN.test(email);
  // }

  // onEmailInput() {
  //   this.registerData.email = this.registerData.email.replace(/\s/g, '');
  // } 


  // isPasswordValid(): boolean {
  //   const password = this.registerData.password;
  //   // Las contraseñas pueden tener espacios internos pero no al inicio/final
  //   return password !== '' && 
  //          password === password.trim() &&
  //          password.length >= 10 && 
  //          this.SPECIAL_CHARS.test(password);
  // }

  // isConfirmPasswordValid(): boolean {
  //   const confirmPassword = this.registerData.confirmPassword;
  //   return confirmPassword !== '' &&
  //          confirmPassword === confirmPassword.trim() &&
  //          this.registerData.password === this.registerData.confirmPassword;
  // }

  // isFullNameValid(): boolean {
  //   const fullName = this.registerData.fullName;
  //   // Permite espacios internos pero no al inicio o final
  //   return fullName !== '' && 
  //          this.NO_SPACES_EDGES_PATTERN.test(fullName) &&
  //          fullName.trim() !== '';
  // }

  // isAddressValid(): boolean {
  //   const address = this.registerData.address;
  //   // Permite espacios internos pero no al inicio o final
  //   return address !== '' && 
  //          this.NO_SPACES_EDGES_PATTERN.test(address) &&
  //          address.trim() !== '';
  // }

  // isPhoneValid(): boolean {
  //   const phone = this.registerData.phone;
  //   // El teléfono no debe tener espacios en absoluto
  //   return phone !== '' && 
  //          phone === phone.trim() && 
  //          !phone.includes(' ') &&
  //          this.PHONE_PATTERN.test(phone);
  // }

  // isAgeValid(): boolean {
  //   if (!this.registerData.birthDate) return false;
    
  //   const today = new Date();
  //   const birthDate = new Date(this.registerData.birthDate);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();
    
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
    
  //   return age >= 18;
  // }

  // // Métodos para verificar si un campo es inválido
  // isFieldInvalid(fieldName: string): boolean {
  //   if (!this.submitted) return false;

  //   switch(fieldName) {
  //     case 'username':
  //       return !this.isUsernameValid();
  //     case 'email':
  //       return !this.isEmailValid();
  //     case 'password':
  //       return !this.isPasswordValid();
  //     case 'confirmPassword':
  //       return !this.isConfirmPasswordValid();
  //     case 'fullName':
  //       return !this.isFullNameValid();
  //     case 'address':
  //       return !this.isAddressValid();
  //     case 'phone':
  //       return !this.isPhoneValid();
  //     case 'birthDate':
  //       return !this.isAgeValid();
  //     default:
  //       return false;
  //   }
  // }

  // // Métodos para obtener mensajes de error
  // getErrorMessage(fieldName: string): string {
  //   if (!this.submitted) return '';

  //   switch(fieldName) {
  //     case 'username':
  //       if (this.registerData.username === '') {
  //         return 'El usuario es requerido';
  //       }
  //       if (this.registerData.username !== this.registerData.username.trim()) {
  //         return 'El usuario no puede tener espacios al inicio o final';
  //       }
  //       return 'El usuario es requerido';
      
  //     case 'email':
  //       if (this.registerData.email === '') {
  //         return 'El email es requerido';
  //       }
  //       if (this.registerData.email !== this.registerData.email.trim()) {
  //         return 'El email no puede tener espacios al inicio o final';
  //       }
  //       return 'Ingrese un email válido';
      
  //     case 'password':
  //       if (this.registerData.password === '') {
  //         return 'La contraseña es requerida';
  //       }
  //       if (this.registerData.password !== this.registerData.password.trim()) {
  //         return 'La contraseña no puede tener espacios al inicio o final';
  //       }
  //       if (this.registerData.password.length < 10) {
  //         return 'La contraseña debe tener al menos 10 caracteres';
  //       }
  //       if (!this.SPECIAL_CHARS.test(this.registerData.password)) {
  //         return 'La contraseña debe contener al menos un símbolo especial (!@#$%^&*)';
  //       }
  //       return '';
      
  //     case 'confirmPassword':
  //       if (this.registerData.confirmPassword === '') {
  //         return 'Debe confirmar la contraseña';
  //       }
  //       if (this.registerData.confirmPassword !== this.registerData.confirmPassword.trim()) {
  //         return 'La confirmación no puede tener espacios al inicio o final';
  //       }
  //       if (this.registerData.password !== this.registerData.confirmPassword) {
  //         return 'Las contraseñas no coinciden';
  //       }
  //       return '';
      
  //     case 'fullName':
  //       if (this.registerData.fullName === '') {
  //         return 'El nombre completo es requerido';
  //       }
  //       if (this.registerData.fullName !== this.registerData.fullName.trim()) {
  //         return 'El nombre no puede tener espacios al inicio o final';
  //       }
  //       return 'El nombre completo es requerido';
      
  //     case 'address':
  //       if (this.registerData.address === '') {
  //         return 'La dirección es requerida';
  //       }
  //       if (this.registerData.address !== this.registerData.address.trim()) {
  //         return 'La dirección no puede tener espacios al inicio o final';
  //       }
  //       return 'La dirección es requerida';
      
  //     case 'phone':
  //       if (this.registerData.phone === '') {
  //         return 'El teléfono es requerido';
  //       }
  //       if (this.registerData.phone.includes(' ')) {
  //         return 'El teléfono no puede contener espacios';
  //       }
  //       if (!/^[0-9]+$/.test(this.registerData.phone)) {
  //         return 'El teléfono debe contener solo números';
  //       }
  //       if (this.registerData.phone.length !== 10) {
  //         return 'El teléfono debe tener exactamente 10 dígitos';
  //       }
  //       return '';
      
  //     case 'birthDate':
  //       return 'Debe ser mayor de 18 años';
      
  //     default:
  //       return '';
  //   }
  // }

  // Método para manejar el envío del formulario
  // onSubmit() {
  //   this.submitted = true;

  //   if (this.validateForm()) {
  //     // Limpiar espacios antes de enviar
  //     this.registerData.username = this.trimValue(this.registerData.username);
  //     this.registerData.email = this.trimValue(this.registerData.email);
  //     this.registerData.fullName = this.trimValue(this.registerData.fullName);
  //     this.registerData.address = this.trimValue(this.registerData.address);
  //     this.registerData.phone = this.trimValue(this.registerData.phone);
      
  //     console.log('Registro exitoso', this.registerData);
  //     alert('¡Registro exitoso!');
  //     // Aquí iría la lógica para guardar el registro
  //   }
  // }
}