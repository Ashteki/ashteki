import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

import './CardMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class CardMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submenu: 'main'
        };
    }

    onMenuItemClick(menuItem) {
        if (['main', 'tokens', 'moves'].includes(menuItem.command)) {
            this.setState({ submenu: menuItem.command });
        } else {
            if (this.props.onMenuItemClick) {
                this.props.onMenuItemClick(menuItem);
            }
        }
    }

    onCloseClick() {
        if (this.props.onCloseClick) {
            this.props.onCloseClick();
        }
    }

    render() {
        let menuIndex = 0;
        let menuItems = this.props.menu.map((menuItem) => {
            let className = classNames('menu-item', {
                disabled: !!menuItem.disabled
            });
            if (menuItem.menu === this.state.submenu) {
                return (
                    <div
                        key={menuIndex++}
                        className={className}
                        onClick={(event) => {
                            this.onMenuItemClick(menuItem);
                            event.stopPropagation();
                        }}
                    >
                        {menuItem.text}
                    </div>
                );
            }
        });

        let menuClass = this.props.side == 'bottom' ? 'bottom-menu' : 'menu';
        return (
            <div className={`panel ${menuClass}`} onClick={this.onCloseClick.bind(this)}>
                <div className='menu-title'>{this.props.cardName}
                    <span className='close-menu-button'><FontAwesomeIcon icon={faTimes} /></span>
                </div>
                {menuItems}
            </div>
        );
    }
}

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    i18n: PropTypes.object,
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(CardMenu);
