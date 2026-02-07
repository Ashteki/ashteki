import React from 'react';
import classNames from 'classnames';

function LifeRemaining({ phoenixborn }) {
    let pbDamage = 0;
    let lifeClass = 'life-green';
    let lifeValue = 0;

    if (phoenixborn) {
        const pbLife = phoenixborn.life;
        pbDamage = phoenixborn.tokens.damage ? phoenixborn.tokens.damage : 0;
        lifeValue = Math.max(0, pbLife - pbDamage - (phoenixborn.drowningLevel || 0));
        if (lifeValue <= 10) {
            lifeClass = 'life-orange';
        }
        if (lifeValue <= 5) {
            lifeClass = 'life-red';
        }
    }

    let classes = classNames('action', 'life-remaining', lifeClass);
    return (
        <div className='state'>
            <span key={`life-rem`} className={classes}>
                <span title='Life remaining'>{lifeValue}</span>
                {phoenixborn?.drowningLevel > 0 && (
                    <span className='drowning-indicator' title='Drowning Level'>
                        ({phoenixborn.drowningLevel})
                    </span>
                )}
            </span>
        </div>
    );
}

LifeRemaining.displayName = 'LifeRemaining';

export default LifeRemaining;
