import { Admin } from '../types';

export default function (state = { banlist: [] }, action) {
    switch (action.type) {
        case Admin.FindUser:
            return Object.assign({}, state, {
                currentUser: undefined
            });
        case Admin.UserFound:
            var user = action.response.user;
            if (user) {
                user.linkedAccounts = action.response.linkedAccounts;
            }

            return Object.assign({}, state, {
                currentUser: user
            });
        case Admin.SaveUser:
            return Object.assign({}, state, {
                userSaved: false
            });
        case Admin.UserSaved:
            return Object.assign({}, state, {
                userSaved: true
            });
        case 'CLEAR_USER_STATUS':
            return Object.assign({}, state, {
                userSaved: false
            });
        case 'NODE_STATUS_RECEIVED':
            return Object.assign({}, state, {
                nodeStatus: action.status
            });
        case 'REQUEST_BANLIST':
            return Object.assign({}, state, {});
        case 'RECEIVE_BANLIST':
            return Object.assign({}, state, {
                banlist: action.response.banlist
            });
        case 'ADD_BANLIST':
            return Object.assign({}, state, {
                banlistAdded: false
            });
        case 'BANLIST_ADDED':
            return Object.assign({}, state, {
                banlistAdded: true,
                banlist: [action.response.entry, ...state.banlist]
            });
        case 'DELETE_BANLIST':
            return Object.assign({}, state, {
                banlistDeleted: false
            });
        case 'BANLIST_DELETED':
            return Object.assign({}, state, {
                banlistDeleted: true,
                banlist: state.banlist.filter((entry) => {
                    return entry.id !== action.response.id;
                })
            });
        case 'CLEAR_BANLIST_STATUS':
            return Object.assign({}, state, {
                banlistAdded: false,
                banlistSaved: false,
                banlistDeleted: false
            });
    }

    return state;
}
