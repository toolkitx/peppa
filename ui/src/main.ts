import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch((err) => {
        const msg = `
        <div style="display: flex; align-items: center; justify-content: center; height: calc(99vh); width: 100%;">
        <div style="font-family: Arial; font-size: 16px;border: 3px solid #ffa39e; line-height: 24px;
        background: #fff1f0; padding: 30px; margin: 30px;">
            <h1>ಠ╭╮ಠ</h1>
            <h1 style="font-weight: bold; font-size: 24px;">An Unexpected Error Occurred</h1>
            <p>Application unable to start correctly, we are sorry for the inconvenience caused, please try these suggestions:</p>
            <ul>
            <li>Make sure you are connected to network</li>
            <li>Reload the web page</li>
            <li>Contact our supports</li>
            </ul>
            <p style="font-size: 12px;">ERROR: ${err.message}</p>
        </div>
        </div>
        `;
        document.write(msg);
    });
