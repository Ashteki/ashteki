import React from 'react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import './DeckStatusSummary.scss';

const DeckStatusSummary = ({ status }) => {
    let { basicRules, hasConjurations, tenDice, uniques } = status;
    let items = [
        { title: 'Basic rules (deck size)', value: basicRules },
        { title: 'Conjurations included', value: hasConjurations },
        { title: 'Ten dice', value: tenDice },
        { title: 'Phoenixborn unique cards', value: uniques }
    ];

    return (
        <ul className='deck-status-summary'>
            {items.map((item, index) => (
                <li className={item.value ? 'valid' : 'invalid'} key={index}>
                    <FontAwesomeIcon icon={item.value ? faCheck : faTimes} />
                    &nbsp;<Trans>{item.title}</Trans>
                </li>
            ))}
        </ul>
    );
};

export default DeckStatusSummary;
