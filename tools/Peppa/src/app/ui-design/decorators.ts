import { WidgetConfigMeta } from './widget-config-meta';
import { WidgetStore } from './widget-config-store';

export function WidgetConfig(config: WidgetConfigMeta) {
    return (type) => {
        config.component = type;
        WidgetStore.push(config);
        console.log(`- Widget config registered: ${config.type}`);
    };
}
