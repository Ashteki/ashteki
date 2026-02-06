import React from 'react';

function ClockPopup({ clockName, mainTime, periods, timePeriod }) {
    return (
        <div className='clock--popup'>
            <div>{clockName}</div>
            <ul>
                {mainTime ? <li>Main Time (Minutes): {mainTime / 60}</li> : ''}
                {periods ? <li>Number of Byoyomi Periods: {periods}</li> : ''}
                {timePeriod ? <li>Byoyomi Time Period (seconds): {timePeriod}</li> : ''}
            </ul>
        </div>
    );
}

ClockPopup.displayName = 'ClockPopup';

export default ClockPopup;
