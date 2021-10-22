export function loadUserStats() {
    return {
        types: ['REQUEST_USERSTATS', 'RECEIVE_USERSTATS'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/stats', cache: false }
    };
}
