export function loadUserStats(months) {
    return {
        types: ['REQUEST_USERSTATS', 'RECEIVE_USERSTATS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/stats',
            data:
            {
                months: months
            },
            cache: false
        }
    };
}
