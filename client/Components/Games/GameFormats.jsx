import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Col } from 'react-bootstrap';

import './GameFormats.scss';

const GameFormats = ({ formProps }) => {
    const { t } = useTranslation();

    let expansions = [
        { name: 'cota', label: t('Call of the Archons') },
        { name: 'aoa', label: t('Age of Ascension') },
        { name: 'wc', label: t('Worlds Collide') },
        { name: 'mm', label: t('Mass Mutation') }
    ];

    return (
        <>
            {formProps.values.gameFormat === 'sealed' && (
                <Form.Row>
                    <Form.Group className='game-formats' as={Col}>
                        {expansions.map((expansion) => {
                            return (
                                <>
                                    <Form.Check
                                        key={expansion.name}
                                        type='switch'
                                        id={expansion.name}
                                        label={expansion.label}
                                        inline
                                        onChange={formProps.handleChange}
                                        value='true'
                                        checked={formProps.values[expansion.name]}
                                    ></Form.Check>
                                </>
                            );
                        })}
                    </Form.Group>
                </Form.Row>
            )}
        </>
    );
};

export default GameFormats;
