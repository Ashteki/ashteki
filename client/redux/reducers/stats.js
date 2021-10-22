function stats(state = {}, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'RECEIVE_USERSTATS':
            newState.stats = action.response.stats;

            break;
        default:
            return state;
    }

    return newState;
}

export default stats;
