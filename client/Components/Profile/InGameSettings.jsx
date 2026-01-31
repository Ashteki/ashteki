import React from 'react';
import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';

const InGameSettings = ({ formProps }) => {
    return (
        <Panel title='Game Settings'>
            <Form.Check
                id='orderForcedAbilities'
                name='gameOptions.orderForcedAbilities'
                label='Prompt to order simultaneous abilities'
                type='switch'
                checked={formProps.values.gameOptions.orderForcedAbilities}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='confirmOneClick'
                name='gameOptions.confirmOneClick'
                label='Show a prompt when initiating 1-click abilities'
                type='switch'
                checked={formProps.values.gameOptions.confirmOneClick}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='allowAutoCancel'
                name='gameOptions.allowAutoCancel'
                label="Allow card switching without pressing 'Cancel' button"
                type='switch'
                checked={formProps.values.gameOptions.allowAutoCancel}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='alwaysGroupTactics'
                name='gameOptions.alwaysGroupTactics'
                label='Always trigger Group Tactics without asking'
                type='switch'
                checked={formProps.values.gameOptions.alwaysGroupTactics}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='dontIceTrapOwnUnits'
                name='gameOptions.dontIceTrapOwnUnits'
                label="Don't prompt to ice trap my own units"
                type='switch'
                checked={formProps.values.gameOptions.dontIceTrapOwnUnits}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='noAttackAlerts'
                name='gameOptions.noAttackAlerts'
                label="Don't alert on attacks (useful for blitz games)"
                type='switch'
                checked={formProps.values.gameOptions.noAttackAlerts}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='noCardZoom'
                name='gameOptions.noCardZoom'
                label="Don't zoom cards on hover"
                type='switch'
                checked={formProps.values.gameOptions.noCardZoom}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='manualAlts'
                name='gameOptions.manualAlts'
                label="Don't use alt arts by default"
                type='switch'
                checked={formProps.values.gameOptions.manualAlts}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='leftMode'
                name='gameOptions.leftMode'
                label='Show the prompt area on left'
                type='switch'
                checked={formProps.values.gameOptions.leftMode}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
            <Form.Check
                id='compactLayout'
                name='gameOptions.compactLayout'
                label='Use compact layout'
                type='switch'
                checked={formProps.values.gameOptions.compactLayout}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
            />
        </Panel>
    );
};

export default InGameSettings;
