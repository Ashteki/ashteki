import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Counter extends React.Component {
    render() {
        let className = classNames('counter', this.props.icon ? this.props.icon : this.props.name, {
            broken: this.props.broken,
            cancel: this.props.cancel,
            'fade-out': this.props.fade
        });

        return (
            <div key={this.props.name} className={className} title={this.props.name}>
                <span className='sr-only'>{this.props.name[0]}</span>
                {this.props.showValue && <span>{this.props.value}</span>}
            </div>
        );
    }
}

Counter.displayName = 'Counter';
Counter.propTypes = {
    broken: PropTypes.bool,
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    showValue: PropTypes.bool,
    value: PropTypes.number
};

export default Counter;
