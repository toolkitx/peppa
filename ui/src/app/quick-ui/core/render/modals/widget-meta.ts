import { Type } from '@angular/core';
import { SlotConf } from './ui-configuration';

/**
 * Supplies configuration metadata for an widget component.
 */
export interface WidgetMeta {
    version: string;
    type: string; // require as build opt will rename the component class
    slotConfClass: Type<SlotConf>;
    component?: Type<any>;
}

