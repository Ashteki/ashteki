import React from 'react';
import classNames from 'classnames';

import './Die.scss';

const DieSlot = () => {
    let description = 'empty slot';

    return <span className='die slot' title={description} />;
};

export default DieSlot;
