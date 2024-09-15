import React from 'react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import './DeckStatusSummary.scss';

const DeckStatusSummary = ({ status, showFormat }) => {
    let { basicRules, maxThree, hasConjurations, tenDice, uniques, hl2pvp } = status;
    let items = [
        { title: 'Basic rules (deck size)', value: basicRules },
        { title: 'Max 3x each card', value: maxThree },
        { title: 'Conjurations included', value: hasConjurations },
        { title: 'Ten dice', value: tenDice },
        { title: 'Phoenixborn unique cards', value: uniques }
    ];
    if (showFormat) {
        items.push({ title: 'Heroic Level 2 Rules', value: hl2pvp });
    }

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
