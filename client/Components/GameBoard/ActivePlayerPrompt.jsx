import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

import AbilityTargeting from './AbilityTargeting';
import OptionsSelect from './OptionsSelect';
import Panel from '../Site/Panel';

import './ActivePlayerPrompt.scss';
import BehaviourPromptControl from './BehaviourPromptControl';

const MaxButtonTextLength = 28;

class ActivePlayerPrompt extends React.Component {
    constructor(props) {
        super(props);

        this.timer = {};
        this.state = {};

        this.onOptionSelected = this.onOptionSelected.bind(this);
    }

    onButtonClick(event, command, arg, uuid, method) {
        event.preventDefault();

        if (this.state.timerHandle) {
            clearInterval(this.state.timerHandle);
        }

        this.setState({ showTimer: false, timerHandle: undefined, timerCancelled: true });

        if (this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, uuid, method);
        }
    }

    onCancelTimerClick(event, button) {
        event.preventDefault();

        if (this.state.timerHandle) {
            clearInterval(this.state.timerHandle);
        }

        this.setState({ showTimer: false, timerHandle: undefined, timerCancelled: true });

        if (button.method) {
            this.props.onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    }

    onMouseOver(event, card) {
        if (card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if (card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    //TODO: remove this
    localizedText(source, text, values) {
        let { t } = this.props;

        if (!isNaN(text)) {
            // text is just a plain number, avoid translation
            return text;
        }

        if (!text) {
            return '';
        }

        return t(text, values);
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if (
            !this.props.promptState.buttons ||
            this.props.promptState.controls.some((c) => ['options-select'].includes(c.type))
        ) {
            return null;
        }

        for (const button of this.props.promptState.buttons) {
            if (button.timer) {
                this.timerUuid = button.uuid;
                continue;
            }

            const originalButtonText = this.localizedText(button.card, button.text, button.values);
            let buttonText = originalButtonText;

            if (buttonText.length > MaxButtonTextLength) {
                buttonText = buttonText.slice(0, MaxButtonTextLength - 3).trim() + '...';
            }

            let clickCallback = button.timerCancel
                ? (event) => this.onCancelTimerClick(event, button)
                : (event) =>
                    this.onButtonClick(
                        event,
                        button.command,
                        button.arg,
                        button.uuid,
                        button.method
                    );

            const btnClass = classNames(
                'btn prompt-button btn-stretch',
                button.class ? button.class : 'btn-default'
            );
            let option = (
                <button
                    key={button.command + buttonIndex.toString()}
                    className={btnClass}
                    title={originalButtonText}
                    onClick={clickCallback}
                    onMouseOver={(event) => this.onMouseOver(event, button.card)}
                    onMouseOut={(event) => this.onMouseOut(event, button.card)}
                    disabled={button.disabled}
                >
                    {buttonText}{' '}
                    {button.icon && <div className={`button-icon icon-${button.icon}`} />}
                </button>
            );

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    }

    onOptionSelected(option) {
        if (this.props.onButtonClick) {
            let button = this.props.promptState.buttons.find((button) => '' + button.arg === option);
            this.props.onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    }

    getControls() {
        if (!this.props.promptState.controls) {
            return null;
        }

        return this.props.promptState.controls.map((control) => {
            switch (control.type) {
                case 'targeting':
                    return (
                        <AbilityTargeting
                            onMouseOut={this.props.onMouseOut}
                            onMouseOver={this.props.onMouseOver}
                            source={control.source}
                            targets={control.targets}
                            trigger={control.trigger}
                        />
                    );
                case 'options-select':
                    return (
                        <OptionsSelect
                            options={this.props.promptState.buttons}
                            onOptionSelected={this.onOptionSelected}
                        />
                    );
                case 'behaviour':
                    return <BehaviourPromptControl behaviour={control.behaviour} />
            }
        });
    }

    getDice() {
        if (!this.props.promptState.diceReq) return;
        let dice = this.props.promptState.diceReq.map((dr, index) => this.getDie(dr, index));

        return <h4>{dice}</h4>;
    }

    getDie(req, index) {
        if (Array.isArray(req)) {
            return (
                <span>
                    {this.getDie(req[0], 10 * index)}
                    <span>=</span>
                    {this.getDie(req[1], 10 * index + 1)}
                </span>
            );
        }
        let title = 'Any basic die';
        let diceFont = 'phg-basic-magic';

        if (req.magic && req.level && req.level !== 'basic') {
            diceFont = `phg-${req.magic}-${req.level}`;
            title = `${req.magic} ${req.level} die`;
        }
        let dieClass = classNames('prompt-die', req.magic ? req.magic : 'any');

        let count = req.count > 1 ? req.count + 'x' : '';
        return (
            <span>
                {count}
                <span key={index} className={dieClass}>
                    <span className={diceFont} title={title}></span>
                </span>
            </span>
        );
    }

    safePromptText(promptObject) {
        if (promptObject) {
            return typeof promptObject === 'string' ? promptObject : promptObject.text;
        }

        return null;
    }

    buttonsAreEqual(oldButtons, newButtons) {
        if (!oldButtons || !newButtons || oldButtons.length !== newButtons.length) {
            return false;
        }

        for (let i = 0; i < oldButtons.length; ++i) {
            if (!_.isEqual(oldButtons[i], newButtons[i])) {
                return false;
            }
        }

        return true;
    }

    UNSAFE_componentWillUpdate(newProps, newState) {
        if (_.difference(newProps.promptState.buttons, this.props.promptState.buttons).length === 0) {
            return;
        }

        const timerLength = newProps.promptState.timerLength;
        if (!timerLength || timerLength === 0) {
            return;
        }

        if (_.any(newProps.promptState.buttons, (button) => button.timer)) {
            if (newState.timerHandle) {
                return;
            }

            this.timer.started = new Date();
            this.timer.timerTime = timerLength;

            let handle = setInterval(() => {
                let now = new Date();
                let difference = (now - this.timer.started) / 1000;
                let keepGoing = true;

                if (difference >= this.timer.timerTime) {
                    clearInterval(this.state.timerHandle);

                    keepGoing = false;

                    this.setState({ timerHandle: undefined });

                    if (newProps.onTimerExpired) {
                        newProps.onTimerExpired(this.timerUuid);
                    }
                }

                let timerClass = (((this.timer.timerTime - difference) / this.timer.timerTime) * 100).toFixed() + '%';
                this.setState({
                    showTimer: keepGoing,
                    timerClass: timerClass,
                    timeLeft: (this.timer.timerTime - difference).toFixed()
                });
            }, 100);

            this.setState({ showTimer: true, timerClass: '100%', timerHandle: handle });
        }
    }

    render() {
        let controlSource = null;
        if (
            this.props.promptState.controls &&
            this.props.promptState.controls.length > 0 &&
            this.props.promptState.controls[0].source
        ) {
            controlSource = this.props.promptState.controls[0].source;
        }

        let promptTitle;

        if (this.props.promptState.promptTitle) {
            let promptTitleText = this.safePromptText(this.props.promptState.promptTitle);

            promptTitle = (
                <div className='menu-pane-source'>
                    {this.localizedText(
                        controlSource,
                        promptTitleText,
                        this.props.promptState.promptTitle.values
                    )}
                </div>
            );
        }

        let timer = null;
        if (this.state.showTimer) {
            timer = (
                <div>
                    <span>Auto passing in {this.state.timeLeft}...</span>
                    <div className='progress'>
                        <div
                            className='progress-bar progress-bar-success'
                            role='progressbar'
                            style={{ width: this.state.timerClass }}
                        />
                    </div>
                </div>);
        }

        let promptText = this.safePromptText(this.props.promptState.menuTitle);
        let promptTexts = [];

        if (promptText) {
            if (promptText.includes('\n')) {
                let split = promptText.split('\n');
                for (let token of split) {
                    promptTexts.push(
                        this.localizedText(controlSource, token, this.props.promptState.menuTitle.values)
                    );
                    promptTexts.push(<br />);
                }
            } else {
                promptTexts.push(
                    this.localizedText(controlSource, promptText, this.props.promptState.menuTitle.values)
                );
            }
        }

        return (
            <Panel type={this.props.promptState.style || 'primary'} title={this.props.t(this.props.phase + ' phase')} titleClass='phase-indicator'>
                {promptTitle}
                {timer}
                <div className='menu-pane'>
                    <h4>{promptTexts}</h4>
                    {this.getDice()}
                    {this.getControls()}
                    {this.getButtons()}
                </div>
            </Panel>
        );
    }
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    i18n: PropTypes.object,
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTimerExpired: PropTypes.func,
    onTitleClick: PropTypes.func,
    phase: PropTypes.string,
    socket: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(ActivePlayerPrompt);
