import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // ✅ Cambia esto

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(), // ✅ Async es preferido en Zoneless
    providePrimeNG({
      theme: { preset: Aura }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};