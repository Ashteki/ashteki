import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TimeLimitClock.scss';

class TimeLimitClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: undefined,
            timeLeft: undefined
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        if (props.timeLimitStarted && !this.state.timer) {
            let timer = setInterval(() => {
                let endTime = moment(this.props.timeLimitStartedAt).add(
                    this.props.timeLimit,
                    'minutes'
                );
                const timeNow = moment();
                const secondsLeft = endTime.diff(timeNow);
                const d = moment.utc(secondsLeft);
                const mins = Math.trunc(secondsLeft / 1000 / 60);
                let time = mins + d.format(':ss');
                this.setState({ timeLeft: time });
            }, 1000);

            this.setState({ timer: timer });
        }
    }

    render() {
        return (
            <span className='clock'>{this.state.timeLeft}</span>
        );
    }
}

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
