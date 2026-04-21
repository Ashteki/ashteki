import React from 'react';
import classNames from 'classnames';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import DeckStatusSummary from './DeckStatusSummary';

import './DeckStatus.scss';

const DeckStatus = ({ deck, status, gameFormat }) => {
    const formatCheck = () => {
        return gameFormat !== 'hl2pvp' || !!status.hl2pvp;
    };
    const showFormat = gameFormat === 'hl2pvp';

    const validFormat = formatCheck();
    let statusName;
    let className = classNames('deck-status', {
        invalid: !status.legalToPlay || !validFormat,
        conjurations: !status.hasConjurations,
        valid: status.legalToPlay
    });

    if (!status.legalToPlay || !validFormat) {
        statusName = 'Invalid';
    } else {
        statusName = 'Valid';
    }

    const popover = (
        <Popover id='deck-status-popover'>
            <Popover.Body>
                <div>
                    <DeckStatusSummary status={status} showFormat={showFormat} showBloodCount={deck.mode === 'chimera'} />
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger='click' rootClose placement='auto' overlay={popover}>
            <div className={className}>{statusName}</div>
        </OverlayTrigger>
    );
};

export default DeckStatus;
