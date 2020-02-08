import { WidgetConfigMeta } from './widget-config-meta';

export const WidgetStore: WidgetConfigMeta[] = [];

export function getWidgetConfigByType(type: string) {
    return WidgetStore.find(x => x.type === type);
}

export function isDevWidget(type: string) {
    return type === 'Custom' || !getWidgetConfigByType(type);
}
