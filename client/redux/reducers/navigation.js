export default function (state = { path: '/' }, action) {
    switch (action.type) {
        case 'SET_URL':
            history.replaceState({}, '', action.path);
            break;
    }

    return state;
}
