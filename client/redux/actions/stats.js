export function loadUserStats(months, gameType) {
    return {
        types: ['REQUEST_USERSTATS', 'RECEIVE_USERSTATS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/stats',
            data:
            {
                months: months,
                gameType: gameType
            },
            cache: false
        }
    };
}
