import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Clock.scss';
import { propTypes } from 'react-bootstrap/esm/Image';


const formattedSeconds = (sec) => (sec < 0 ? '-' : '') + Math.floor(Math.abs(sec) / 60) + ':' + ('0' + Math.abs(sec) % 60).slice(-2);

class Clock extends React.Component {
    constructor() {
        super();

        this.state = { timeLeft: 0, periods: 0, mainTime: 0, timePeriod: 0 };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (this.stateId === newProps.stateId || newProps.secondsLeft === 0) {
            return;
        }
        if (newProps.finishedAt) {
            if (this.timerHandle) {
                clearInterval(this.timerHandle);
            }
            return;
        }
        this.stateId = newProps.stateId;
        this.setState({
            timeLeft: newProps.secondsLeft,
            periods: newProps.periods,
            mainTime: newProps.mainTime,
            timePeriod: newProps.timePeriod
        });

        if (this.timerHandle) {
            clearInterval(this.timerHandle);
        }

        if (newProps.mode !== 'stop') {
            this.timerHandle = setInterval(() => {
                this.setState({
                    timeLeft: this.state.timeLeft + (newProps.mode === 'up' ? 1 : -1)
                });
                if (this.state.timeLeft < 0) {
                    this.setState({
                        timeLeft: 0
                    });
                    clearInterval(this.timerHandle);
                }
                if (newProps.winner) {
                    clearInterval(this.timerHandle);
                }
            }, 1000);
        }
    }

    getFormattedClock() {
        return formattedSeconds(this.state.timeLeft);
    }

    render() {
        let className = classNames('clock', {
            'expired-timer': this.state.timeLeft <= 0
        });
        return <span className={className}>{this.getFormattedClock()}</span>;
    }
}

Clock.displayName = 'Clock';
Clock.propTypes = {
    mainTime: PropTypes.number,
    mode: PropTypes.string,
    periods: PropTypes.number,
    secondsLeft: PropTypes.number,
    stateId: PropTypes.number,
    timePeriod: PropTypes.number,
    gameFinished: PropTypes.number
};

export default Clock;
