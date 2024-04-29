import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NgToastModule } from 'ng-angular-popup';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routing } from './app/app.routing';
import { RouterModule } from '@angular/router';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, RouterModule, routing, ServiceWorkerModule.register("/ngsw-worker.js", {
            enabled: environment.production,
        }), NgToastModule),
        provideHttpClient(withInterceptorsFromDi())
    ]
});
