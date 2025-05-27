import React, { useState, useEffect, useRef } from 'react';
import _ from 'underscore';

import './SplashPlayerPrompt.scss';
import ActivePromptDice from './ActivePromptDice';
import ActivePromptButtons from './ActivePromptButtons';
import ActivePromptControls from './ActivePromptControls';
import CardImage from './CardImage';

function SplashPlayerPrompt({ promptState, onButtonClick, onMouseOver, onMouseOut, onTimerExpired }) {
    const [showTimer, setShowTimer] = useState(false);
    const [timerClass, setTimerClass] = useState('100%');
    const [timeLeft, setTimeLeft] = useState(undefined);
    const [timerCancelled, setTimerCancelled] = useState(false);
    const timerHandle = useRef(undefined);
    const timer = useRef({});
    const timerUuid = useRef(undefined);

    // Option selected handler
    const onOptionSelected = (option) => {
        if (onButtonClick) {
            let button = promptState.buttons.find((button) => '' + button.arg === option);
            onButtonClick(button.command, button.arg, button.uuid, button.method);
        }
    };

    // Button click handler
    const doButtonClick = (event, command, arg, uuid, method) => {
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
    const doCancelTimerClick = (event, button) => {
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

    // Prompt text(s)
    let promptText = promptState.menuTitle;
    let promptTexts = [];
    if (promptText) {
        if (promptText.includes('\n')) {
            let split = promptText.split('\n');
            for (let token of split) {
                promptTexts.push(token);
                promptTexts.push(<br key={token} />);
            }
        } else {
            promptTexts.push(promptText);
        }
    }

    const showBigCard =
        promptState.controls &&
        promptState.controls[0] &&
        promptState.controls[0].type === 'targeting' &&
        promptState.controls[0].source.id;
    const bigCardSource = showBigCard ? promptState.controls[0].source : null;
    // Render
    return (
        <div className='splash-player-prompt'>
            {promptState.promptTitle && (
                <div className='menu-pane-source'>{promptState.promptTitle}</div>
            )}
            {timerDisplay}
            <div className='menu-pane'>
                {showBigCard && (
                    <div className='big-card'
                        onMouseOut={() => onMouseOut && onMouseOut(bigCardSource)}
                        onMouseOver={() => onMouseOver && onMouseOver(bigCardSource)}
                    >
                        <CardImage card={bigCardSource} />
                    </div>
                )}
                <div className='menu-pane-content'>
                    <p className='splash-text'>{promptTexts}</p>
                    {promptState.diceReq && <ActivePromptDice dice={promptState.diceReq} />}
                    {!showBigCard && promptState.controls && (
                        <ActivePromptControls
                            controls={promptState.controls}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
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
                                onButtonClick={doButtonClick}
                                onCancelTimerClick={doCancelTimerClick}
                                onMouseOver={onMouseOver}
                                onMouseOut={onMouseOut}
                            />
                        )}
                </div>
            </div>
        </div>
    );
}

SplashPlayerPrompt.displayName = 'ActivePlayerPrompt';

export default SplashPlayerPrompt;