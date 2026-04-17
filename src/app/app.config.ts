import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PermissionsService } from './services/permissions.service';

export function initializePermissions(permissionsSvc: PermissionsService) {
  return () => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.resolve();
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const permisosMap: Record<number, string> = {
        1: 'user:view', 2: 'user:add', 3: 'user:edit', 4: 'user:edit:profile',
        5: 'user:delete', 6: 'user:manage', 7: 'group:view', 8: 'group:add',
        9: 'group:edit', 10: 'group:delete', 11: 'group:manage',
        12: 'tickets:view', 13: 'tickets:add', 14: 'tickets:edit', 15: 'tickets:delete',
        16: 'tickets:edit:state', 17: 'tickets:edit:comment', 18: 'tickets:manage',
        19: 'tickets:move', 20: 'group:add:member', 21: 'group:delete:member',
        22: 'group:edit:config', 23: 'tickets:move:own'
      };
      
      let permisos: string[] = [];
      
      if (payload.globalPermissions) {
        permisos = payload.globalPermissions.map((id: number) => permisosMap[id]).filter(Boolean);
      }
      
      const grupoGuardado = localStorage.getItem('grupoSeleccionado');
      if (grupoGuardado) {
        const grupo = JSON.parse(grupoGuardado);
        if (payload.permissionsByGroup && payload.permissionsByGroup[grupo.id]) {
          const permisosGrupo = payload.permissionsByGroup[grupo.id].permisos;
          if (permisosGrupo) {
            const permisosGrupoStrings = permisosGrupo.map((id: number) => permisosMap[id]).filter(Boolean);
            permisos = [...new Set([...permisos, ...permisosGrupoStrings])];
          }
        }
      }
      
      if (permisos.length === 0) {
        permisos = ['group:view', 'tickets:view'];
      }
      
      permissionsSvc.setPermissions(permisos);
      console.log('Permisos inicializados:', permisos);
    } catch (error) {
      console.error('Error al inicializar permisos:', error);
    }
    
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializePermissions,
      deps: [PermissionsService],
      multi: true
    }
  ]
};