import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import DeckStatusSummary from './DeckStatusSummary';

import './DeckStatus.scss';

const DeckStatus = ({ status }) => {
    const { t } = useTranslation();

    let statusName;
    let className = classNames('deck-status', {
        invalid: !status.basicRules || !status.hasConjurations || !status.tenDice || !status.uniques,
        conjurations: !status.hasConjurations,
        valid: status.basicRules && status.hasConjurations && status.tenDice && status.uniques
    });

    if (!status.basicRules || !status.hasConjurations || !status.tenDice || !status.uniques) {
        statusName = t('Invalid');
    } else {
        statusName = t('Valid');
    }

    const popover = (
        <Popover id='deck-status-popover'>
            <Popover.Content>
                <div>
                    <DeckStatusSummary status={status} />
                </div>
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger placement='right' overlay={popover}>
            <span className={className}>{statusName}</span>
        </OverlayTrigger>
    );
};

export default DeckStatus;
