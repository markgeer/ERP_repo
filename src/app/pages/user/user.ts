import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../services/api.service';

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
    AvatarModule,
    TableModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent implements OnInit {
  userData = {
    id: 0,
    username: '',
    email: '',
    fullName: '',
    address: '',
    phone: '',
    birthDate: null as Date | null
  };

  lastLogin: Date = new Date();
  editando: boolean = false;
  cambiandoPassword: boolean = false;
  newPassword: string = '';
  confirmNewPassword: string = '';
  userBackup: any = {};
  submitted: boolean = false;
  maxDate: Date = new Date();
  
  ticketsAsignados: any[] = [];
  totalTickets = 0;
  ticketsPendientes = 0;

  private readonly SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PHONE_PATTERN = /^[0-9]{10}$/;
  private readonly NO_SPACES_EDGES_PATTERN = /^\S.*\S$/;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPerfil();
    this.cargarTicketsAsignados();
  }

  cargarPerfil() {
    console.log('=== CARGANDO PERFIL ===');
    const token = localStorage.getItem('token');
    console.log('Token existe?', !!token);
    
    if (!token) return;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;
    console.log('UserId desde token:', userId);
    
    this.apiService.getUser(userId).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response.statusCode === 200) {
          const user = response.data;
          console.log('Datos del usuario:', user);
          this.userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.nombre_completo || '',
            address: user.direccion || '',
            phone: user.telefono || '',
            birthDate: null
          };
          console.log('userData después de asignar:', this.userData);
          this.cdr.detectChanges();
        } else {
          console.log('Error en respuesta:', response);
        }
      },
      error: (error) => {
        console.error('Error detallado:', error);
      }
    });
  }

  cargarTicketsAsignados() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;
    
    // Obtener tickets asignados al usuario
    const grupoGuardado = localStorage.getItem('grupoSeleccionado');
    const grupoId = grupoGuardado ? JSON.parse(grupoGuardado).id : 1;
    
    this.apiService.getTickets(grupoId).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.ticketsAsignados = response.data
            .filter((t: any) => t.asignado_id === userId)
            .map((t: any) => ({
              id: t.id,
              titulo: t.titulo,
              estado: t.estados?.nombre || 'Desconocido',
              prioridad: t.prioridades?.nombre || 'Media'
            }));
          this.totalTickets = this.ticketsAsignados.length;
          this.ticketsPendientes = this.ticketsAsignados.filter(t => t.estado === 'Pendiente').length;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
      }
    });
  }

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
           this.isPhoneValid();
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
      this.apiService.updateUser(this.userData.id, { password: this.newPassword }).subscribe({
        next: () => {
          this.cambiandoPassword = false;
          this.newPassword = '';
          this.confirmNewPassword = '';
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente' });
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cambiar contraseña' });
        }
      });
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
    console.log('=== GUARDAR LLAMADO ===');
    this.submitted = true;
    console.log('formValido?', this.formValido());
    
    if (this.formValido()) {
      const updateData = {
        nombre_completo: this.userData.fullName,
        email: this.userData.email,
        direccion: this.userData.address,
        telefono: this.userData.phone
      };
      
      console.log('Enviando datos de actualización:', updateData);
      
      this.apiService.updateUser(this.userData.id, updateData).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          if (response.statusCode === 200) {
            this.editando = false;
            this.cambiandoPassword = false;
            this.newPassword = '';
            this.confirmNewPassword = '';
            this.submitted = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
            this.cargarPerfil();
          }
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar perfil' });
        }
      });
    } else {
      console.log('Formulario inválido, campos con error:', {
        email: this.isEmailValid(),
        fullName: this.isFullNameValid(),
        address: this.isAddressValid(),
        phone: this.isPhoneValid()
      });
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

  tieneSimboloEspecial(password: string): boolean {
    return /[!@#$%^&*]/.test(password);
  }

  eliminar() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.apiService.deleteUser(this.userData.id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.messageService.add({ severity: 'success', summary: 'Cuenta eliminada', detail: 'Tu cuenta ha sido eliminada' });
            setTimeout(() => {
              window.location.href = '/landing';
            }, 1500);
          }
        },
        error: (error) => {
          console.error('Error detallado:', error.error); // 👈 Ver el error del backend
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.data?.error || 'No se pudo eliminar la cuenta' });
        }
      });
    }
  }

  getEstadoSeverity(estado: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch(estado) {
      case 'Pendiente': return 'warn';
      case 'En Progreso': return 'info';
      case 'Hecho': return 'success';
      default: return 'secondary';
    }
  }
}