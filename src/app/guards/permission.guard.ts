// guards/permission.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard {
  constructor(
    private router: Router,
    private permissionsSvc: PermissionsService
  ) {}

  canActivate(route: any): boolean {
    const requiredPermission = route.data['permission'];
    if (requiredPermission && !this.permissionsSvc.hasPermission(requiredPermission)) {
      this.router.navigate(['/group-dashboard']);
      return false;
    }
    return true;
  }
}