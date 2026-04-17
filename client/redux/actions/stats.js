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

export function loadEloLadder() {
    return {
        types: ['REQUEST_ELOLADDER', 'RECEIVE_ELOLADDER'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/stats/elo',
            cache: false
        }
    };
}

export function loadCardStats(cardName, includeSolo) {
    return {
        types: ['REQUEST_CARDSTATS', 'RECEIVE_CARDSTATS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/cardstats',
            data: { card: cardName, includeSolo: includeSolo },
            cache: false
        }
    };
}
