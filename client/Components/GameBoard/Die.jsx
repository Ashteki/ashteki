import React from 'react';

import './Die.scss';

class Die extends React.Component {
    constructor(props) {
        super(props);
        this.diceFont = 'phg-basic-magic';

        if (props.die.magic && props.die.level && props.die.level !== 'basic') {
            this.diceFont = `phg-${props.die.magic}-${props.die.level}`;
        }
        this.colorClass = props.die.magic;
        if (props.die.exhausted) {
            this.colorClass = 'exhausted';
        }
    }

    onClick(event, die) {
        event.preventDefault();
        event.stopPropagation();

        if (this.props.onClick) {
            this.props.onClick(die);
        }
    }

    render() {
        return (
            <span
                className={`die ${this.colorClass}`}
                onClick={(ev) => this.onClick(ev, this.props.die)}
            >
                <span className={this.diceFont} title={`${this.props.die.magic}`}></span>
            </span>
        );
    }
}

export default Die;
