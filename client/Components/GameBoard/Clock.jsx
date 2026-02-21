import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import './Clock.scss';

const formattedSeconds = (sec) => (sec < 0 ? '-' : '') + Math.floor(Math.abs(sec) / 60) + ':' + ('0' + Math.abs(sec) % 60).slice(-2);

function Clock({ stateId, secondsLeft, mode, finishedAt, onClockZero }) {
    const [clockState, setClockState] = useState({ timeLeft: 0 });
    const timerHandleRef = useRef(null);
    const stateIdRef = useRef(stateId);

    useEffect(() => {
        if (stateIdRef.current === stateId || secondsLeft === 0) {
            return;
        }

        if (finishedAt) {
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
            }
            return;
        }

        stateIdRef.current = stateId;
        setClockState({
            timeLeft: secondsLeft
        });

        if (timerHandleRef.current) {
            clearInterval(timerHandleRef.current);
        }

        if (mode !== 'stop') {
            timerHandleRef.current = setInterval(() => {
                setClockState((prevState) => {
                    const newTimeLeft = prevState.timeLeft + (mode === 'up' ? 1 : -1);

                    if (newTimeLeft <= 0 && onClockZero) {
                        onClockZero();
                    }

                    return {
                        ...prevState,
                        timeLeft: newTimeLeft <= 0 ? 0 : newTimeLeft
                    };
                });
            }, 1000);
        }

        return () => {
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
            }
        };
    }, [stateId, secondsLeft, mode, finishedAt, onClockZero]);

    let className = classNames('clock', {
        'expired-timer': clockState.timeLeft <= 0
    });

    return <span className={className}>{formattedSeconds(clockState.timeLeft)}</span>;
}

Clock.displayName = 'Clock';

export default Clock;
