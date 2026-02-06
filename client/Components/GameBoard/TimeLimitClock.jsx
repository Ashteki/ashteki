import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './TimeLimitClock.scss';

function TimeLimitClock({ timeLimit, timeLimitStarted, timeLimitStartedAt }) {
    const [timeLeft, setTimeLeft] = useState(undefined);

    useEffect(() => {
        if (!timeLimitStarted) {
            return;
        }

        const timer = setInterval(() => {
            let endTime = moment(timeLimitStartedAt).add(timeLimit, 'minutes');
            const timeNow = moment();
            const secondsLeft = endTime.diff(timeNow);
            const d = moment.utc(secondsLeft);
            const mins = Math.trunc(secondsLeft / 1000 / 60);
            let time = mins + d.format(':ss');
            setTimeLeft(time);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLimitStarted, timeLimitStartedAt, timeLimit]);

    return <span className='clock'>{timeLeft}</span>;
}

TimeLimitClock.displayName = 'TimeLimitClock';

export default TimeLimitClock;
