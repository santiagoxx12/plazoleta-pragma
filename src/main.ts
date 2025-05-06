import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { Amplify } from 'aws-amplify';
import awsConfig from './app/core/config/aws-exports';
// import { authConfig } from './auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './app/auth/auth.config';


try {

  Amplify.configure(awsConfig as any);
  console.log('Amplify v6 configurado correctamente al inicio de la aplicación');

} catch (error) {
  console.error('Error al configurar Amplify:', error);
}


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideAuth(authConfig)
  ]
}).catch(err => console.error('Error al inicializar la aplicación:', err));
