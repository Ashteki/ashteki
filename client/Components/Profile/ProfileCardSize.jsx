import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import CardSizeSelector from './CardSizeSelector';

const ProfileCardSize = ({ selectedCardSize, onCardSizeSelected }) => {
    const { t } = useTranslation();

    return (
        <Panel title={t('Card Image Size')}>
            <Row>
                <Col xs='12'>
                    <CardSizeSelector
                        selectedCardSize={selectedCardSize}
                        onCardSizeSelected={onCardSizeSelected}
                    />
                </Col>
            </Row>
        </Panel>
    );
};

export default ProfileCardSize;
