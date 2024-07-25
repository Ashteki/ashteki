export function receiveUsers(users) {
    return {
        type: 'RECEIVE_USERS',
        users: users
    };
}

export function receiveLobbyMessage(message) {
    return {
        type: 'RECEIVE_LOBBY_MSG',
        message: message
    };
}

export function receiveLobbyMessages(messages) {
    return {
        type: 'RECEIVE_LOBBY_MSGS',
        messages: messages
    };
}

export function removeLobbyMessage(messageId) {
    return {
        types: ['REMOVE_MESSAGE', 'MESSAGE_REMOVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/messages/${messageId}`,
            cache: false,
            type: 'DELETE'
        }
    };
}

export function getLeaguePairings(tag) {
    return {
        types: ['REQUEST_PAIRINGS', 'RECEIVE_PAIRINGS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/league/${tag.toLowerCase()}/pairings`,
            cache: false,
            data: {
                tag: tag
            }
        }
    };
}

export function clearLeaguePairings() {
    return {
        type: 'CLEAR_PAIRINGS'
    };
}

export function getAllPairings() {
    return {
        types: ['REQUEST_ALL_PAIRINGS', 'RECEIVE_ALL_PAIRINGS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/league/pairings`,
            cache: false
        }
    };
}

export function replayStepForward() {
    return {
        type: 'REPLAY_FORWARD'
    };
}