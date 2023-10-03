import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const SpectatorIcon = () => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const spectatorCount = currentGame.spectators.length;
    const [showPopup, setShowPopup] = useState(false);

    const spectators = currentGame.spectators.map((spectator) => {
        return <li key={spectator.id}>{spectator.name}</li>;
    });
    let spectatorPopup = <ul className='spectators-popup absolute-panel'>{spectators}</ul>;

    return (
        <>
            <span
                onMouseOver={() => setShowPopup(currentGame.spectators.length > 0 && true)}
                onMouseOut={() => setShowPopup(false)}
            >
                <FontAwesomeIcon icon={faEye} /> {spectatorCount}</span>
            {showPopup && spectatorPopup}
        </>
    );
};

export default SpectatorIcon;
