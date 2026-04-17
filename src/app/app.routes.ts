import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Landing } from './pages/landing/landing';
import { Auth } from './pages/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { GruposComponent } from './pages/grupos/grupos';
import { UserComponent } from './pages/user/user';
import { GruposDashboardComponent } from './pages/grupos-dashboard/grupos-dashboard';
import { GroupDashboardComponent } from './pages/group-dashboard/group-dashboard';
import { KanbanComponent } from './pages/kanban/kanban';
import { TicketCreateComponent } from './pages/ticket/ticket-create/ticket-create';
import { TicketDetailComponent } from './pages/ticket/ticket-detail/ticket-detail';
import { TicketListComponent } from './pages/ticket/ticket-list/ticket-list';
import { GroupManagementComponent } from './pages/group-management/group-management';
import { UserManagementComponent } from './pages/user-management/user-management';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  // Rutas públicas (sin layout)
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'auth', component: Auth },
  { path: 'register', component: Register },
  
  // Rutas protegidas (con MainLayout)
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'grupos', component: GruposComponent },
      { path: 'profile', component: UserComponent },
      { path: 'grupos-dashboard', component: GruposDashboardComponent },
      { path: 'group-dashboard', component: GroupDashboardComponent },
      { path: 'kanban', component: KanbanComponent,canActivate: [PermissionGuard], data: { permission: 'tickets:view' } },
      { path: 'tickets', component: TicketListComponent, canActivate: [PermissionGuard], data: { permission: 'tickets:view' } },
      { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [PermissionGuard], data: { permission: 'tickets:view' } },
      { path: 'ticket-create', component: TicketCreateComponent, canActivate: [PermissionGuard], data: { permission: 'tickets:add' } },
      { path: 'group-management', component: GroupManagementComponent },
      { path: 'user-management', component: UserManagementComponent },
    ]
  },
  
  // Ruta wildcard (siempre al final)
  { path: '**', redirectTo: '' }
];