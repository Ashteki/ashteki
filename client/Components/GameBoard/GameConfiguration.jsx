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
                    <div className='advice'>
                        Note: Changes made here will only affect the current game.
                    </div>
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
                            id='leftPrompt'
                            name='gameOptions.leftPrompt'
                            label={t('Show the prompt area on left')}
                            type='switch'
                            checked={optionSettings.leftPrompt}
                            onChange={(event) =>
                                onOptionSettingToggle('leftPrompt', event.target.checked)
                            }
                        />
                        <Form.Check
                            id='alwaysGroupTactics'
                            name='gameOptions.alwaysGroupTactics'
                            label={t('Always trigger Group Tactics without asking')}
                            type='switch'
                            checked={optionSettings.alwaysGroupTactics}
                            onChange={(event) =>
                                onOptionSettingToggle('alwaysGroupTactics', event.target.checked)
                            }
                        />
                        <Form.Check
                            id='dontIceTrapOwnUnits'
                            name='gameOptions.dontIceTrapOwnUnits'
                            label={t("Don't prompt to ice trap my own units")}
                            type='switch'
                            checked={optionSettings.dontIceTrapOwnUnits}
                            onChange={(event) =>
                                onOptionSettingToggle('dontIceTrapOwnUnits', event.target.checked)
                            }
                        />                        <div className='bluffTimer'>
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
                        <div className='alertTimer'>
                            Alert Timer (seconds):
                            <RangeSlider
                                name='gameOptions.alertTimer'
                                label='Alert Timer'
                                min='0'
                                max='10'
                                tooltip='on'
                                value={optionSettings.alertTimer}
                                onChange={(event) =>
                                    onOptionSettingToggle('alertTimer', event.target.value)
                                }
                            />
                        </div>
                        <br />
                    </Form.Row>
                </Panel>
            </Form>
        </div >
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
