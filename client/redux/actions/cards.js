export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards || Object.values(state.cards.cards).length === 0;
        },
        APIParams: { url: '/api/cards', cache: false }
    };
}

export function loadAlts() {
    return {
        types: ['REQUEST_ALTS', 'RECEIVE_ALTS'],
        shouldCallAPI: (state) => {
            return !state.cards.alts || Object.values(state.cards.alts).length === 0;
        },
        APIParams: { url: '/api/cards/alts', cache: false }
    };
}
