/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import Login from './pages/LoginContainer';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Decks from './pages/Decks';
import AddDeck from './pages/AddDeck';
import EditDeck from './pages/EditDeck';
import Results from './pages/Results';

import ImportDeck from './Components/Decks/ImportDeck';
import Security from './pages/profile/Security.jsx';
import Activation from './pages/Activation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserAdmin from './pages/UserAdmin';
import Profile from './pages/profile/Profile';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard.jsx';
import BlockList from './pages/profile/BlockList';
import NodesAdmin from './pages/NodesAdmin';
import BanlistAdmin from './pages/BanlistAdmin';
import Patreon from './pages/Patreon';
import FAQ from './pages/faq';
import TaggedGames from './pages/admin/TaggedGames.jsx';
import CardsPage from './pages/CardsPage.jsx';
import UserAltAdmin from './pages/UserAltAdmin.jsx';

const routes = [
    {
        path: ['/', '/play'],
        action: (context) =>
            context.currentGame?.started ? (
                <GameBoard key='gameboard' />
            ) : (
                <GameLobby key='gamelobby' gameId={context.params.gameId} />
            )
    },
    {
        path: '/activation',
        action: (context) => (
            <Activation key='activation' id={context.params.id} token={context.params.token} />
        )
    },
    { path: '/cards', action: () => <CardsPage key='cards' /> },
    { path: '/decks', action: () => <Decks key='decks' /> },
    { path: '/decks/add', action: () => <AddDeck /> },
    { path: '/decks/edit', action: (params) => <EditDeck deckId={params.deckId} /> },
    { path: '/decks/import', action: () => <ImportDeck key='importDecks' /> },
    { path: '/forgot', action: () => <ForgotPassword key='forgotpassword' /> },
    { path: '/login', action: () => <Login key='login' /> },
    { path: '/logout', action: () => <Logout key='logout' /> },
    { path: '/results', action: () => <Results key='results' /> },
    { path: '/faq', action: () => <FAQ key='faq' /> },
    { path: '/profile', action: () => <Profile key='profile' /> },
    { path: '/register', action: () => <Register key='register' /> },
    // PASSING PARAMETERS!
    // {
    //     path: '/alts/:username',
    //     action: (args) => <UserAlts key='altarts' user={args.params.username} />
    // },
    {
        path: '/reset-password',
        action: (context) => (
            <ResetPassword
                key='resetpassword'
                id={context.params.id}
                token={context.params.token}
            />
        )
    },
    { path: '/patreon', action: (context) => <Patreon code={context.params.code} /> },
    { path: '/blocklist', action: () => <BlockList key='blocklist' /> },
    { path: '/security', action: () => <Security key='security' /> },
    // admin
    { path: '/users', action: () => <UserAdmin key='useradmin' />, permission: 'canManageUsers' },
    {
        path: '/useralts',
        action: () => <UserAltAdmin key='useralts' />,
        permission: 'canManageTournaments'
    },
    { path: '/nodes', action: () => <NodesAdmin key='nodesadmin' />, permission: 'canManageNodes' },
    {
        path: '/banlist',
        action: () => <BanlistAdmin key='banlist' permission='canManageBanlist' />
    },
    { path: '/taggedgames', action: () => <TaggedGames /> }
];

export default routes;
