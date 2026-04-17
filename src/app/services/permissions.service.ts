import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private userPermissions = signal<string[]>([]);

  setPermissions(perms: string[]) {
    this.userPermissions.set(perms);
  }

  getPermissions(): string[] {
    return this.userPermissions();
  }

  hasPermission(permiso: string): boolean {
    const userPerms = this.userPermissions();
    
    // Si tiene tickets:manage, tiene todos los tickets:*
    if (permiso.startsWith('tickets:') && userPerms.includes('tickets:manage')) {
      return true;
    }
    
    // Si tiene group:manage, tiene todos los group:*
    if (permiso.startsWith('group:') && userPerms.includes('group:manage')) {
      return true;
    }
    
    // Si tiene user:manage, tiene todos los user:*
    if (permiso.startsWith('user:') && userPerms.includes('user:manage')) {
      return true;
    }
    
    return userPerms.includes(permiso);
  }

  hasAnyPermission(perms: string[]): boolean {
    return perms.some(p => this.hasPermission(p));
  }
}