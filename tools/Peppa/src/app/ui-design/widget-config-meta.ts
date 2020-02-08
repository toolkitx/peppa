import { Type } from '@angular/core';

export interface WidgetConfigMeta {
    type: string;
    defaultConfig: any;
    description?: string;
    tags?: string[];
    previewComponent?: Type<any>;
    component?: Type<any>;
}
