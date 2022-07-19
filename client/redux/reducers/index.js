import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import api from './api';
import admin from './admin';
import user from './user';
import stats from './stats';
import account from './account';
import lobby from './lobby';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation,
    auth,
    cards,
    games,
    toastr: toastrReducer,
    api,
    admin,
    user,
    account,
    lobby,
    stats
});

export default rootReducer;
