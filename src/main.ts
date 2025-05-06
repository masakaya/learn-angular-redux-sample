import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Initialize MSW in development mode
async function prepareApp() {
  if (environment.useMsw) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // Ignore unhandled requests
    });
    console.log('MSW initialized');
  }

  return bootstrapApplication(AppComponent, appConfig);
}

prepareApp()
  .catch((err) => console.error(err));
