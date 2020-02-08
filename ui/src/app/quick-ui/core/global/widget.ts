// All widgets mappings
import { WidgetMeta } from '../render/modals/widget-meta';

export const WidgetStore: WidgetMeta[] = [];

// Get widget definition by type
export function getWidgetByType(type: string) {
    return WidgetStore.find(x => x.type === type);
}
