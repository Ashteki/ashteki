import React, { useState, useEffect, useRef } from 'react';
import _ from 'underscore';
import Panel from '../Site/Panel';

import './ActivePlayerPrompt.scss';
import ActivePromptDice from './ActivePromptDice';
import ActivePromptButtons from './ActivePromptButtons';
import ActivePromptControls from './ActivePromptControls';
import { useTranslation } from 'react-i18next';

function ActivePlayerPrompt(props) {
    const [showTimer, setShowTimer] = useState(false);
    const [timerClass, setTimerClass] = useState('100%');
    const [timeLeft, setTimeLeft] = useState(undefined);
    const [timerCancelled, setTimerCancelled] = useState(false);
    const timerHandle = useRef(undefined);
    const timer = useRef({});
    const timerUuid = useRef(undefined);
    const { t } = useTranslation();

    // Option selected handler
    const onOptionSelected = (option) => {
        if (props.onButtonClick) {
            let button = props.promptState.buttons.find((button) => '' + button.arg === option);
            props.onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    // Button click handler
    const onButtonClick = (event, command, arg, uuid, method) => {
        event.preventDefault();
        if (timerHandle.current) {
            clearInterval(timerHandle.current);
        }
        setShowTimer(false);
        timerHandle.current = undefined;
        setTimerCancelled(true);

        if (props.onButtonClick) {
            props.onButtonClick(command, arg, uuid, method);
        }
    };

    // Cancel timer click handler
    const onCancelTimerClick = (event, button) => {
        event.preventDefault();
        if (timerHandle.current) {
            clearInterval(timerHandle.current);
        }
        setShowTimer(false);
        timerHandle.current = undefined;
        setTimerCancelled(true);

        if (button.method) {
            props.onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    // Mouse over/out handlers
    const onMouseOver = (event, card) => {
        if (card && props.onMouseOver) {
            props.onMouseOver(card);
        }
    };
    const onMouseOut = (event, card) => {
        if (card && props.onMouseOut) {
            props.onMouseOut(card);
        }
    };

    // Timer effect: runs when promptState.buttons or promptState.timerLength changes
    useEffect(() => {
        // Find timer button uuid
        if (props.promptState.buttons) {
            for (const button of props.promptState.buttons) {
                if (button.timer) {
                    timerUuid.current = button.uuid;
                    break;
                }
            }
        }

        // Timer logic
        const timerLength = props.promptState.timerLength;
        if (!timerLength || timerLength === 0) {
            return;
        }
        if (_.any(props.promptState.buttons, (button) => button.timer)) {
            if (timerHandle.current) {
                return;
            }
            timer.current.started = new Date();
            timer.current.timerTime = timerLength;

            const handle = setInterval(() => {
                let now = new Date();
                let difference = (now - timer.current.started) / 1000;
                let keepGoing = true;

                if (difference >= timer.current.timerTime) {
                    clearInterval(handle);
                    keepGoing = false;
                    timerHandle.current = undefined;
                    if (props.onTimerExpired) {
                        props.onTimerExpired(timerUuid.current);
                    }
                }

                let percent = (((timer.current.timerTime - difference) / timer.current.timerTime) * 100);
                percent = percent < 0 ? 0 : percent;
                setShowTimer(keepGoing);
                setTimerClass(percent.toFixed() + '%');
                setTimeLeft((timer.current.timerTime - difference).toFixed());
            }, 100);

            setShowTimer(true);
            setTimerClass('100%');
            timerHandle.current = handle;

            // Cleanup on unmount or change
            return () => {
                if (timerHandle.current) {
                    clearInterval(timerHandle.current);
                    timerHandle.current = undefined;
                }
            };
        }
        // Cleanup if timer is not needed
        return () => {
            if (timerHandle.current) {
                clearInterval(timerHandle.current);
                timerHandle.current = undefined;
            }
        };
        // eslint-disable-next-line
    }, [props.promptState.buttons, props.promptState.timerLength]);

    // Timer display
    let timerDisplay = null;
    if (showTimer) {
        timerDisplay = (
            <div>
                <span>Auto passing in {timeLeft}...</span>
                <div className='progress'>
                    <div
                        className='progress-bar progress-bar-success'
                        role='progressbar'
                        style={{ width: timerClass }}
                    />
                </div>
            </div>
        );
    }

    const safePromptText = (promptObject) => {
        if (promptObject) {
            return typeof promptObject === 'string' ? promptObject : promptObject.text;
        }

        return null;
    };

    // Prompt text(s)
    let promptText = safePromptText(props.promptState.menuTitle);
    let promptTexts = [];
    if (promptText) {
        if (promptText.includes('\n')) {
            let split = promptText.split('\n');
            for (let token of split) {
                promptTexts.push(t(token, props.promptState.menuTitle.values));
                promptTexts.push(<br key={token} />);
            }
        } else {
            promptTexts.push(t(promptText, props.promptState.menuTitle.values));
        }
    }

    // Render
    return (
        <Panel
            type={props.promptState.style || 'primary'}
            title={props.phase + ' phase'}
            titleClass='phase-indicator'
        >
            {props.promptState.promptTitle && (
                <div className='menu-pane-source'>{
                    t(
                        safePromptText(
                            props.promptState.promptTitle),
                        props.promptState.promptTitle.values
                    )
                }</div>
            )}
            {timerDisplay}
            <div className='menu-pane'>
                <h4>{promptTexts}</h4>
                {props.promptState.diceReq && <ActivePromptDice dice={props.promptState.diceReq} />}
                {props.promptState.controls && (
                    <ActivePromptControls
                        controls={props.promptState.controls}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onOptionSelected={onOptionSelected}
                    />
                )}
                {props.promptState.buttons &&
                    (!props.promptState.controls ||
                        !props.promptState.controls.some((c) =>
                            ['options-select'].includes(c.type)
                        )) && (
                        <ActivePromptButtons
                            buttons={props.promptState.buttons}
                            timerUuid={timerUuid.current}
                            onButtonClick={onButtonClick}
                            onCancelTimerClick={onCancelTimerClick}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                        />
                    )}
            </div>
        </Panel>
    );
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';

export default ActivePlayerPrompt;