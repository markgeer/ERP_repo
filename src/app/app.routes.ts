import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Landing } from './pages/landing/landing';
import { Auth } from './pages/auth/auth';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { GruposComponent } from './pages/grupos/grupos';


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
    children: [
      { path: 'home', component: Home },
      { path: 'grupos', component: GruposComponent }
      // Puedes agregar más rutas protegidas aquí
      // { path: 'profile', component: Profile },
      // { path: 'settings', component: Settings },
    ]
  },
  
  // Ruta wildcard (siempre al final)
  { path: '**', redirectTo: '' }
];