export function inspectCard(card) {
    return {
        type: 'INSPECT_CARD',
        card: card
    };
}

export function clearInspector() {
    return {
        type: 'CLEAR_INSPECTOR'
    };
}
