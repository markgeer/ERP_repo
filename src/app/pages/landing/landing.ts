import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonModule, CardModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  constructor(private router: Router) {}

  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegister() {
    this.router.navigate(['/register']);
  }
}