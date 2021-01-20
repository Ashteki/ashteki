import React from 'react';
import Die from './Die';

import './DiceBox.scss';

class DiceBox extends React.Component {
    constructor(props) {
        super(props);
    }

    getDice() {
        return (
            this.props.dice
                // .filter(aDie => aDie.level === level)
                .sort((a, b) => (a.magic + a.level > b.magic + b.level ? -1 : 1))
                .map((thisDie) => (
                    <Die
                        key={thisDie.id}
                        die={thisDie}
                        onClick={this.props.onDieClick}
                        onMenuItemClick={this.props.onMenuItemClick}
                        onMouseOut={this.props.onMouseOut}
                        onMouseOver={this.props.onMouseOver}
                    />
                ))
        );
    }

    render() {
        return (
            <div className={`dice ${this.props.size}`}>
                {/* <div className="group"> */}
                {this.getDice()}
                {/* </div> */}
            </div>
        );
    }
}

export default DiceBox;
