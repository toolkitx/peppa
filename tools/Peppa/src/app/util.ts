export function newWidgetId() {
    return newUniqueName('widget');
}

export function newViewName(prefix = 'view') {
    return newUniqueName(prefix);
}

export function newUniqueName(prefix: string) {
    return `${prefix}_${new Date().getTime() + Math.floor((Math.random() * 100) + 1)}`;
}
