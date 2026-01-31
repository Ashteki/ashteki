import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Counter from './Counter';

import './CardCounters.scss';

const CardCounters = ({ counters, size }) => {
    if (counters.length === 0) {
        return null;
    }

    let manyLimit = 3;
    if (size === 'large') {
        manyLimit = 3;
    }
    let countersClass = classNames('counters', 'ignore-mouse-events', {
        'many-counters': counters.length > manyLimit
    });

    let counterDivs = [];

    for (const [key, counter] of Object.entries(counters)) {
        counterDivs.push(
            <Counter
                key={key}
                broken={counter.broken}
                name={counter.name}
                icon={counter.icon}
                value={counter.count}
                fade={counter.fade}
                cancel={counter.cancel}
                showValue={counter.showValue}
                shortName={counter.shortName}
            />
        );
    }

    return <div className={countersClass}>{counterDivs}</div>;
};

CardCounters.displayName = 'CardCounters';
CardCounters.propTypes = {
    counters: PropTypes.array.isRequired
};

export default CardCounters;
