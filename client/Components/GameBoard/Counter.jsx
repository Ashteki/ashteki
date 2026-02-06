import React from 'react';
import classNames from 'classnames';

function Counter({ name, icon, broken, cancel, fade, showValue, value }) {
    let className = classNames('counter', icon ? icon : name, {
        broken: broken,
        cancel: cancel,
        'fade-out': fade
    });

    return (
        <div key={name} className={className} title={name}>
            <span className='sr-only'>{name[0]}</span>
            {showValue && <span>{value}</span>}
        </div>
    );
}

Counter.displayName = 'Counter';

export default Counter;
