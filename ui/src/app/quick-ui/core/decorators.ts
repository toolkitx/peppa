// Widget decorator
import { WidgetStore } from './global';
import { WidgetMeta } from './render/modals/widget-meta';
import { QUI } from './global/qui';

/**
 * Widget decorator interface
 *
 */
export function Widget(config: WidgetMeta) {
    return (type) => {
        config.component = type;
        WidgetStore.push(config);
        QUI.log(`- Widget ready: ${config.type}`);
    };
}
