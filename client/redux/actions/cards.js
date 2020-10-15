export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards || Object.values(state.cards.cards).length === 0;
        },
        APIParams: { url: '/api/cards', cache: false }
    };
}
