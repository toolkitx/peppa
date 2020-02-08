import { environment } from '../../../../environments/environment';

export const QUI = {
    get log(): Function {
        if (environment.production) {
            return () => {};
        } else {
            return console.log.bind(window.console, '[QUI]: ');
        }
    },
    get error(): Function {
        if (environment.production) {
            return () => {};
        } else {
            return console.error.bind(window.console, '[QUI]: ');
        }
    }
};
