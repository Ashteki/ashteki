import React from 'react';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

const GameConfiguration = ({ optionSettings, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Form>
                <Panel title={t('Game Settings')}>
                    <Form.Row>
                        <Form.Check
                            id='orderForcedAbilities'
                            name='optionSettings.orderForcedAbilities'
                            label={t('Prompt to order simultaneous abilities')}
                            type='switch'
                            checked={optionSettings.orderForcedAbilities}
                            onChange={(event) =>
                                onOptionSettingToggle('orderForcedAbilities', event.target.checked)
                            }
                        />
                        <Form.Check
                            id='confirmOneClick'
                            name='gameOptions.confirmOneClick'
                            label={t('Show a prompt when initating 1-click abilities')}
                            type='switch'
                            checked={optionSettings.confirmOneClick}
                            onChange={(event) =>
                                onOptionSettingToggle('confirmOneClick', event.target.checked)
                            }
                        />

                        <div className='fullWidth'>
                            Bluff Timer (seconds):
                            <RangeSlider
                                name='gameOptions.bluffTimer'
                                label='Bluff Timer'
                                min='0'
                                max='10'
                                tooltip='on'
                                value={optionSettings.bluffTimer}
                                onChange={(event) =>
                                    onOptionSettingToggle('bluffTimer', event.target.value)
                                }
                            />
                        </div>
                        <br />
                    </Form.Row>
                </Panel>
            </Form>
        </div>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
