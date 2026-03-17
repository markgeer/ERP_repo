import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Grupo } from '../../models/grupo.interface';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    CardModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {
  grupos: Grupo[] = [];
  grupoDialog: boolean = false;
  grupo: Grupo = this.inicializarGrupo();
  submitted: boolean = false;
  
  // Opciones para nivel (puedes ajustar según necesites)
  niveles: any[] = [
    { label: 'Básico', value: 'Básico' },
    { label: 'Intermedio', value: 'Intermedio' },
    { label: 'Avanzado', value: 'Avanzado' }
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarGruposIniciales();
  }

  inicializarGrupo(): Grupo {
    return {
      nivel: '',
      autor: '',
      nombre: '',
      integrantes: 0,
      tickets: 0,
      descripcion: ''
    };
  }

  cargarGruposIniciales() {
    // Datos de ejemplo (Registro 2, perfiles 1-5)
    this.grupos = [
      { id: 1, nivel: 'Básico', autor: 'Juan Pérez', nombre: 'Grupo Alpha', integrantes: 5, tickets: 4, descripcion: 'Grupo de principiantes' },
      { id: 2, nivel: 'Intermedio', autor: 'María García', nombre: 'Grupo Beta', integrantes: 8, tickets: 7, descripcion: 'Grupo intermedio' },
      { id: 3, nivel: 'Avanzado', autor: 'Carlos López', nombre: 'Grupo Gamma', integrantes: 6, tickets: 5, descripcion: 'Grupo avanzado' },
      { id: 4, nivel: 'Básico', autor: 'Ana Martínez', nombre: 'Grupo Delta', integrantes: 7, tickets: 6, descripcion: 'Grupo básico 2' },
      { id: 5, nivel: 'Intermedio', autor: 'Pedro Sánchez', nombre: 'Grupo Epsilon', integrantes: 4, tickets: 3, descripcion: 'Grupo intermedio 2' }
    ];
  }

  abrirNuevo() {
    this.grupo = this.inicializarGrupo();
    this.submitted = false;
    this.grupoDialog = true;
  }

  editarGrupo(grupo: Grupo) {
    this.grupo = { ...grupo };
    this.grupoDialog = true;
  }

  eliminarGrupo(grupo: Grupo) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar el grupo ' + grupo.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.grupos = this.grupos.filter(g => g.id !== grupo.id);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo eliminado', life: 3000 });
      }
    });
  }

  guardarGrupo() {
    this.submitted = true;

    if (this.camposValidos()) {
      if (this.grupo.id) {
        // Actualizar
        const index = this.grupos.findIndex(g => g.id === this.grupo.id);
        if (index !== -1) {
          this.grupos[index] = { ...this.grupo };
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado', life: 3000 });
        }
      } else {
        // Crear nuevo
        this.grupo.id = this.grupos.length + 1;
        this.grupos.push({ ...this.grupo });
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado', life: 3000 });
      }
      
      this.grupoDialog = false;
      this.grupo = this.inicializarGrupo();
    }
  }

  camposValidos(): boolean {
    const nombreValido = !!this.grupo.nombre?.trim();
    const autorValido = !!this.grupo.autor?.trim();
    const nivelValido = !!this.grupo.nivel?.trim();
    const integrantesValidos = this.grupo.integrantes > 0;
    
    return nombreValido && autorValido && nivelValido && integrantesValidos;
  }

  ocultarDialog() {
    this.grupoDialog = false;
    this.submitted = false;
  }
}