function ingame(state = {}, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'INSPECT_CARD':
            newState.inspectionCard = action.card;

            break;
        case 'CLEAR_INSPECTOR':
            newState.inspectionCard = null;

            break;
        default:
            return state;
    }

    return newState;
}

export default ingame;
