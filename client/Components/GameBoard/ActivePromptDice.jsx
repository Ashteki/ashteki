import React from 'react';
import classNames from 'classnames';

function ActivePromptDice({ dice }) {
    const getDie = (req, index) => {
        if (Array.isArray(req)) {
            return (
                <span>
                    {getDie(req[0], 10 * index)}
                    <span>=</span>
                    {getDie(req[1], 10 * index + 1)}
                </span>
            );
        }
        let title = 'Any basic die';
        let diceFont = 'phg-basic-magic';

        if (req.magic && req.level && req.level !== 'basic') {
            diceFont = `phg-${req.magic}-${req.level}`;
            title = `${req.magic} ${req.level} die`;
        }
        let dieClass = classNames('prompt-die', req.magic ? req.magic : 'any');

        let count = req.count > 1 ? req.count + 'x' : '';
        return (
            <span>
                {count}
                <span key={index} className={dieClass}>
                    <span className={diceFont} title={title}></span>
                </span>
            </span>
        );
    }

    return (
        <div className="active-prompt-dice">
            {dice.map((die, idx) => getDie(die, idx))}

        </div>
    );
}

export default ActivePromptDice;