import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { CardModule } from 'primeng/card';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, InputOtpModule, CardModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ERP');
}
