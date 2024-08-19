import { Account } from '../types';

export default function (state = {}, action) {
    switch (action.type) {
        case 'REGISTER_ACCOUNT':
            return Object.assign({}, state, {
                registered: false
            });
        case 'ACCOUNT_REGISTERED':
            return Object.assign({}, state, {
                registered: true
            });
        case 'LOGIN_ACCOUNT':
            return Object.assign({}, state, {
                loggedIn: false
            });
        case 'ACCOUNT_LOGGEDIN':
            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user
            });
        case 'ACCOUNT_LOGGEDOUT':
            return Object.assign({}, state, {
                loggedIn: false,
                loggedOut: true,
                user: undefined
            });
        case 'RESETPASSWORD_ACCOUNT':
            return Object.assign({}, state, {
                passwordReset: false
            });
        case 'ACCOUNT_PASSWORDRESET':
            return Object.assign({}, state, {
                passwordReset: true
            });
        case Account.ActivateAccount:
            return Object.assign({}, state, {
                activated: false
            });
        case Account.AccountActivated:
            return Object.assign({}, state, {
                activated: true
            });
        case 'ACCOUNT_AUTH_VERIFIED':
            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user
            });
        case 'PROFILE_SAVED':
            var u = Object.assign({}, action.response.user);
            u.settings = Object.assign({}, u.settings);
            u.settings.optionSettings = Object.assign({}, u.settings.optionSettings);
            return Object.assign({}, state, {
                user: u
            });
        case 'ACCOUNT_LINK_RESPONSE':
            var u = Object.assign({}, action.response.user);
            u.patreon = action.response.status;
            return Object.assign({}, state, {
                accountLinked: true,
                user: u
            });
        case 'CLEAR_LINK_STATUS':
            return Object.assign({}, state, {
                accountLinked: undefined
            });
        case 'ACCOUNT_UNLINKED':
            var user = state.user;

            if (user) {
                user.patreon = undefined;
            }

            return Object.assign({}, state, {
                accountLinked: undefined,
                user: user
            });
        case 'view/changeViewSetting':
            var newState = Object.assign({}, state);
            if (action.setting === 'cardSize') {
                newState.user.settings.cardSize = action.value;
            } else {
                newState.user.settings.optionSettings[action.setting] = action.value;
            }
            return newState;
    }

    return state;
}
