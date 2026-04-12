import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input('ifHasPermission') permissions: string | string[] = '';

  constructor(
    private permissionsSvc: PermissionsService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    const permissionsArray = Array.isArray(this.permissions) ? this.permissions : [this.permissions];
    
    if (this.permissionsSvc.hasAnyPermission(permissionsArray)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}