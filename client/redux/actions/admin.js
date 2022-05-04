import { Admin } from '../types';

export function findUser(username) {
    return {
        types: [Admin.FindUser, Admin.UserFound],
        shouldCallAPI: () => true,
        APIParams: { url: `/api/user/${username}`, cache: false }
    };
}

export function clearUserSessions(username) {
    return (dispatch, getState) => {
        var socket = getState().lobby.socket;

        if (!socket) {
            return;
        }

        socket.emit('clearsessions', username);
    };
}

export function saveUser(user) {
    return {
        types: [Admin.SaveUser, Admin.UserSaved],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/user/${user.username}`,
            cache: false,
            type: 'PUT',
            data: JSON.stringify({ userToChange: user })
        }
    };
}

export function clearUserStatus() {
    return {
        type: 'CLEAR_USER_STATUS'
    };
}
