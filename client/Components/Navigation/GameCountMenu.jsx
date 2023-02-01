import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import classNames from 'classnames';

import './GameCountMenu.scss';
import Link from './Link';

const GameCountMenu = () => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const games = useSelector((state) => state.lobby.games);
    const user = useSelector((state) => state.account.user);
    const [showPopup, setShowPopup] = useState(false);

    const isSpectating = !currentGame?.players[user?.username];
    if (!isSpectating) {
        return null;
    }
    const gameCount = games.length;
    const emptyGame = games.some((g) => !g.started && Object.values(g.players).length === 1) ? 'empty-game' : '';
    const gameList = games.map((game) => {
        const players = Object.values(game.players);
        if (!players.length) {
            return null;
        }
        const p1Name = players[0].name;
        const p2Name = players.length > 1 ? players[1].name : '??';
        const liClass = 'game-count-list-item'

        return <li key={game.id} className={liClass}>{p1Name} vs {p2Name}</li>;
    });
    const linkClass = classNames('patreon-link', { 'empty-game': emptyGame });
    let gamesPopup = <ul className='games-popup mt-5 absolute-panel'>{gameList}</ul>;
    return (
        <div className='game-count-menu'>
            <Link key='games-link' href='/play'>
                <Nav.Link onMouseOver={() => setShowPopup(true)} onMouseOut={() => setShowPopup(false)}>
                    <span className={linkClass}>{games?.length} Games</span>
                </Nav.Link>
            </Link>

            {showPopup && gameCount > 0 && gamesPopup}
        </div>
    );
};

export default GameCountMenu;
