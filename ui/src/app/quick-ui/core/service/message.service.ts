import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    success(content: string | TemplateRef<void>, options?: any): any {
    }

    error(content: string | TemplateRef<void>, options?: any): any {
    }

    warning(content: string | TemplateRef<void>, options?: any): any {
    }

    loading(content: string | TemplateRef<void>, options?: any): any {
    }

    create(type: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, content: string | TemplateRef<void>, options?: any): any {
    }
}
