import React, { useState, useEffect, useRef } from 'react';
import _ from 'underscore';
import Panel from '../Site/Panel';

import './ActivePlayerPrompt.scss';
import ActivePromptDice from './ActivePromptDice';
import ActivePromptButtons from './ActivePromptButtons';
import ActivePromptControls from './ActivePromptControls';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

function ActivePlayerPrompt({ promptState, phase, onButtonClick, onMouseOver, onMouseOut, onTimerExpired }) {
    const [showTimer, setShowTimer] = useState(false);
    const [timerClass, setTimerClass] = useState('100%');
    const [timeLeft, setTimeLeft] = useState(undefined);
    const [timerCancelled, setTimerCancelled] = useState(false);
    const timerHandle = useRef(undefined);
    const timer = useRef({});
    const timerUuid = useRef(undefined);
    const { t } = useTranslation();
    const currentGame = useSelector((state) => state.lobby.currentGame);


    // Option selected handler
    const onOptionSelected = (option) => {
        if (onButtonClick) {
            let button = promptState.buttons.find((button) => '' + button.arg === option);
            onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    // Button click handler
    const btnHandler = (event, command, arg, uuid, method) => {
        event.preventDefault();
        if (timerHandle.current) {
            clearInterval(timerHandle.current);
        }
        setShowTimer(false);
        timerHandle.current = undefined;
        setTimerCancelled(true);

        if (onButtonClick) {
            onButtonClick(command, arg, uuid, method);
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
            onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    // Mouse over/out handlers
    const mouseOverHandler = (event, card) => {
        if (card && onMouseOver) {
            onMouseOver(card);
        }
    };
    const mouseOutHandler = (event, card) => {
        if (card && onMouseOut) {
            onMouseOut(card);
        }
    };

    // Timer effect: runs when promptState.buttons or promptState.timerLength changes
    useEffect(() => {
        // Find timer button uuid
        if (promptState.buttons) {
            for (const button of promptState.buttons) {
                if (button.timer) {
                    timerUuid.current = button.uuid;
                    break;
                }
            }
        }

        // Timer logic
        const timerLength = promptState.timerLength;
        if (!timerLength || timerLength === 0) {
            return;
        }
        if (_.any(promptState.buttons, (button) => button.timer)) {
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
                    if (onTimerExpired) {
                        onTimerExpired(timerUuid.current);
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
    }, [promptState.buttons, promptState.timerLength]);

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
    let promptText = safePromptText(promptState.menuTitle);
    let promptTexts = [];
    if (promptText) {
        if (promptText.includes('\n')) {
            let split = promptText.split('\n');
            for (let token of split) {
                promptTexts.push(t(token, promptState.menuTitle.values));
                promptTexts.push(<br key={token} />);
            }
        } else {
            promptTexts.push(t(promptText, promptState.menuTitle.values));
        }
    }

    // Render
    return (
        <Panel
            type={promptState.style || 'primary'}
            title={'R' + currentGame.round + ': ' + phase + ' phase'}
            titleClass='phase-indicator'
        >
            {promptState.promptTitle && (
                <div className='menu-pane-source'>{
                    t(
                        safePromptText(
                            promptState.promptTitle),
                        promptState.promptTitle.values
                    )
                }</div>
            )}
            {timerDisplay}
            <div className='menu-pane'>
                <h4>{promptTexts}</h4>
                {promptState.diceReq && <ActivePromptDice dice={promptState.diceReq} />}
                {promptState.controls && (
                    <ActivePromptControls
                        controls={promptState.controls}
                        onMouseOver={mouseOverHandler}
                        onMouseOut={mouseOutHandler}
                        onOptionSelected={onOptionSelected}
                    />
                )}
                {promptState.buttons &&
                    (!promptState.controls ||
                        !promptState.controls.some((c) =>
                            ['options-select'].includes(c.type)
                        )) && (
                        <ActivePromptButtons
                            buttons={promptState.buttons}
                            timerUuid={timerUuid.current}
                            onButtonClick={btnHandler}
                            onCancelTimerClick={onCancelTimerClick}
                            onMouseOver={mouseOverHandler}
                            onMouseOut={mouseOutHandler}
                        />
                    )}
            </div>
        </Panel>
    );
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';

export default ActivePlayerPrompt;