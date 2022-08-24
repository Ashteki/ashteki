import React from 'react';
import Avatar from '../Site/Avatar';

import './PlayerName.scss';

const PlayerName = ({ player }) => {
    let userClass = 'username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');
    let userStyle = {};
    if (player.faveColor) {
        userStyle.color = player.faveColor;
    }

    const sprout =
        player.gamesPlayed < 10 ? <span className='emoji-sprout' title='new player'></span> : null;

    return (
        <span>
            <Avatar imgPath={player.avatar} />
            <span className={userClass} style={userStyle}>
                {player.name}
            </span>{' '}
            {sprout}
        </span>
    );
};

export default PlayerName;
