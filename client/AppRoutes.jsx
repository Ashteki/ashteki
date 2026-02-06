import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import AddDeck from './pages/AddDeck';
import EditDeck from './pages/EditDeck';

import Activation from './pages/Activation';
import BanlistAdmin from './pages/BanlistAdmin';
import BlockList from './pages/profile/BlockList';
import Decks from './pages/Decks';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/LoginContainer';
import Logout from './pages/Logout';
import NodesAdmin from './pages/NodesAdmin';
import NotFound from './pages/NotFound';
import Patreon from './pages/Patreon';
import Profile from './pages/profile/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Security from './pages/profile/Security.jsx';
import Unauthorised from './pages/Unauthorised';
import UserAdmin from './pages/UserAdmin';
import ImportDeck from './Components/Decks/ImportDeck';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard.jsx';
import FAQ from './pages/faq';
import CardsPage from './pages/CardsPage';
import Results from './pages/Results';
import TaggedGames from './pages/admin/TaggedGames';
import UserAltAdmin from './pages/UserAltAdmin';

const AppRoutes = ({ currentGame, user }) => {
    const [searchParams] = useSearchParams();
    const getParam = (key) => searchParams.get(key) || undefined;

    const requirePermission = (permission, element) => {
        if (!permission) {
            return element;
        }

        if (!user || !user.permissions?.[permission]) {
            return <Unauthorised />;
        }

        return element;
    };

    return (
        <Routes>
            <Route path='/'
                element={
                    currentGame?.started ? <GameBoard /> : <GameLobby gameId={getParam('gameId')} />
                }
            />
            <Route
                path='/play'
                element={
                    currentGame?.started ? <GameBoard /> : <GameLobby gameId={getParam('gameId')} />
                }
            />

            <Route
                path='/activation'
                element={<Activation id={getParam('id')} token={getParam('token')} />}
            />
            <Route
                path='/banlist'
                element={requirePermission(
                    'canManageBanlist',
                    <BanlistAdmin permission='canManageBanlist' />
                )}
            />
            <Route path='/blocklist' element={<BlockList />} />
            <Route path='/cards' element={<CardsPage />} />
            <Route path='/decks' element={<Decks />} />
            <Route path='/decks/add' element={<AddDeck />} />
            <Route path='/decks/edit' element={<EditDeck deckId={getParam('deckId')} />} />
            <Route path='/decks/import' element={<ImportDeck />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path='/forgot' element={<ForgotPassword />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/nodes' element={requirePermission('canManageNodes', <NodesAdmin />)} />
            <Route path='/patreon' element={<Patreon code={getParam('code')} />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/register' element={<Register />} />
            <Route
                path='/reset-password'
                element={<ResetPassword id={getParam('id')} token={getParam('token')} />}
            />
            <Route path='/results' element={<Results />} />

            <Route path='/security' element={<Security />} />
            <Route
                path='/taggedgames'
                element={requirePermission('canManageTournaments', <TaggedGames />)}
            />
            <Route path='/users' element={requirePermission('canManageUsers', <UserAdmin />)} />
            <Route
                path='/useralts'
                element={requirePermission('canManageTournaments', <UserAltAdmin />)}
            />

            <Route path='*' element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
