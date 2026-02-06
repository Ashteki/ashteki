import React, { useState, useCallback } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

import './CardMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function CardMenu({ cardName, menu, onMenuItemClick, onCloseClick, side, t }) {
    const [submenu, setSubmenu] = useState('main');

    const handleMenuItemClick = useCallback((menuItem) => {
        if (['main', 'tokens', 'moves'].includes(menuItem.command)) {
            setSubmenu(menuItem.command);
        } else {
            if (onMenuItemClick) {
                onMenuItemClick(menuItem);
            }
        }
    }, [onMenuItemClick]);

    const handleCloseClick = useCallback(() => {
        if (onCloseClick) {
            onCloseClick();
        }
    }, [onCloseClick]);

    let menuIndex = 0;
    let menuItems = menu.map((menuItem) => {
        let className = classNames('menu-item', {
            disabled: !!menuItem.disabled
        });
        if (menuItem.menu === submenu) {
            return (
                <div
                    key={menuIndex++}
                    className={className}
                    onClick={(event) => {
                        handleMenuItemClick(menuItem);
                        event.stopPropagation();
                    }}
                >
                    {menuItem.text}
                </div>
            );
        }
    });

    let menuClass = side == 'bottom' ? 'bottom-menu' : 'menu';
    return (
        <div className={`panel ${menuClass}`} onClick={handleCloseClick}>
            <div className='menu-title'>{cardName}
                <span className='close-menu-button'><FontAwesomeIcon icon={faTimes} /></span>
            </div>
            {menuItems}
        </div>
    );
}

CardMenu.displayName = 'CardMenu';

export default withTranslation()(CardMenu);
