import React from 'react';
import Avatar from '../Site/Avatar';

import './PlayerName.scss';

const PlayerName = ({ player }) => {
    let userClass = 'username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');
    let userStyle = {};
    if (player.faveColor) {
        userStyle.color = player.faveColor;
    }

    const getExpLevel = (player) => {
        if (player.gamesPlayed < 12) {
            return <span className='emoji-sprout' title='new player'></span>;
        }

        // could put other emojis in here

        return null;
    };

    return (
        <span>
            <Avatar imgPath={player.avatar} />
            <span className={userClass} style={userStyle}>
                {player.name || player.username}
            </span>{' '}
            {getExpLevel(player)}
        </span>
    );
};

export default PlayerName;
