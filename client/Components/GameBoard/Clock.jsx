import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import './Clock.scss';

const formattedSeconds = (sec) => (sec < 0 ? '-' : '') + Math.floor(Math.abs(sec) / 60) + ':' + ('0' + Math.abs(sec) % 60).slice(-2);

function Clock({ stateId, secondsLeft, mode, finishedAt, onClockZero }) {
    const [timeLeft, setTimeLeft] = useState(secondsLeft);
    const timerHandleRef = useRef(null);
    const stateIdRef = useRef(stateId);

    useEffect(() => {
        // if (stateIdRef.current === stateId || secondsLeft === 0) {
        //     return;
        // }

        if (finishedAt) {
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
            }
            return;
        }

        stateIdRef.current = stateId;
        // setTimeLeft(secondsLeft);

        // if (timerHandleRef.current) {
        //     clearInterval(timerHandleRef.current);
        // }

        if (mode !== 'stop') {
            timerHandleRef.current = setInterval(() => {
                const newTimeLeft = timeLeft + (mode === 'up' ? 1 : -1);
                if (newTimeLeft <= 0 && onClockZero) {
                    onClockZero();
                }

                setTimeLeft(newTimeLeft <= 0 ? 0 : newTimeLeft);
            }, 1000);
        }

        return () => {
            if (timerHandleRef.current) {
                clearInterval(timerHandleRef.current);
            }
        };
    }, [stateId, timeLeft, mode, finishedAt, onClockZero]);

    let className = classNames('clock', {
        'expired-timer': timeLeft <= 0
    });

    return <span className={className}>{formattedSeconds(timeLeft)}</span>;
}

Clock.displayName = 'Clock';

export default Clock;
