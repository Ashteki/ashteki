import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import './Clock.scss';

const formattedSeconds = (sec) => (sec < 0 ? '-' : '') + Math.floor(Math.abs(sec) / 60) + ':' + ('0' + Math.abs(sec) % 60).slice(-2);

function Clock({ stateId, secondsLeft, periods, mainTime, timePeriod, mode, finishedAt, winner, onClockZero }) {
    const [clockState, setClockState] = useState({ timeLeft: 0, periods: 0, mainTime: 0, timePeriod: 0 });
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
            timeLeft: secondsLeft,
            periods: periods,
            mainTime: mainTime,
            timePeriod: timePeriod
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
    }, [stateId, secondsLeft, periods, mainTime, timePeriod, mode, finishedAt, winner, onClockZero]);

    let className = classNames('clock', {
        'expired-timer': clockState.timeLeft <= 0
    });

    return <span className={className}>{formattedSeconds(clockState.timeLeft)}</span>;
}

Clock.displayName = 'Clock';

export default Clock;
