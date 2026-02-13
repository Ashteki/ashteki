import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import DeckStatusSummary from './DeckStatusSummary';

import './DeckStatus.scss';

const DeckStatus = ({ status, gameFormat }) => {
    const { t } = useTranslation();
    const formatCheck = () => {
        return gameFormat !== 'hl2pvp' || !!status.hl2pvp;
    };
    const showFormat = gameFormat === 'hl2pvp';

    const validFormat = formatCheck();
    let statusName;
    let className = classNames('deck-status', {
        invalid:
            !status.basicRules ||
            !status.maxThree ||
            !status.hasConjurations ||
            !status.tenDice ||
            !status.uniques ||
            !validFormat,
        conjurations: !status.hasConjurations,
        valid: status.basicRules && status.hasConjurations && status.tenDice && status.uniques
    });

    if (
        !status.basicRules ||
        !status.maxThree ||
        !status.hasConjurations ||
        !status.tenDice ||
        !status.uniques ||
        !validFormat
    ) {
        statusName = t('Invalid');
    } else {
        statusName = t('Valid');
    }

    const popover = (
        <Popover id='deck-status-popover'>
            <Popover.Body>
                <div>
                    <DeckStatusSummary status={status} showFormat={showFormat} />
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger placement='auto' overlay={popover}>
            <span className={className}>{statusName}</span>
        </OverlayTrigger>
    );
};

export default DeckStatus;
