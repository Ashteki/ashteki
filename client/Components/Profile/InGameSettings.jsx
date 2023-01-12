import React from 'react';
import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef InGameSettingsProps
 * @property {import('formik').FormikProps<ProfileDetails>} formProps
 * @property {User} user
 */

/**
 * @param {InGameSettingsProps} props
 */
const InGameSettings = ({ formProps }) => {
    const { t } = useTranslation();

    return (
        <Panel title={t('Game Settings')}>
            <Form.Row>
                <Form.Check
                    id='orderForcedAbilities'
                    name='gameOptions.orderForcedAbilities'
                    label={t('Prompt to order simultaneous abilities')}
                    type='switch'
                    checked={formProps.values.gameOptions.orderForcedAbilities}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
                <Form.Check
                    id='confirmOneClick'
                    name='gameOptions.confirmOneClick'
                    label={t('Show a prompt when initating 1-click abilities')}
                    type='switch'
                    checked={formProps.values.gameOptions.confirmOneClick}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
                <Form.Check
                    id='leftPrompt'
                    name='gameOptions.leftPrompt'
                    label={t('Show the prompt area on left')}
                    type='switch'
                    checked={formProps.values.gameOptions.leftPrompt}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
                <Form.Check
                    id='alwaysGroupTactics'
                    name='gameOptions.alwaysGroupTactics'
                    label={t('Always trigger Group Tactics without asking')}
                    type='switch'
                    checked={formProps.values.gameOptions.alwaysGroupTactics}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
                <Form.Check
                    id='dontIceTrapOwnUnits'
                    name='gameOptions.dontIceTrapOwnUnits'
                    label={t("Don't prompt to ice trap my own units")}
                    type='switch'
                    checked={formProps.values.gameOptions.dontIceTrapOwnUnits}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />            </Form.Row>
        </Panel>
    );
};

export default InGameSettings;
