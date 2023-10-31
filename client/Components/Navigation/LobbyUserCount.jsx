import React from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

const LobbyUserCount = () => {
    const count = useSelector((state) => state.lobby.users?.length);
    return (
        <li className='server-status'>
            <span>
                {count}&nbsp;
                <FontAwesomeIcon icon={faUserGroup} title={`${count} users are here`} />
            </span>
        </li>
    );
};

export default LobbyUserCount;
