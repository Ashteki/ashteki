import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Link from './Link';
import Avatar from '../Site/Avatar';

/**
 * @typedef ProfileMenuProps
 * @property {import('./Navigation').MenuItem[]} menu
 * @property {User} user
 */

/**
 * @param {ProfileMenuProps} props
 */
const ProfileMenu = (props) => {
    const { t } = useTranslation();

    if (!props.user) {
        return null;
    }

    const title = (
        <span>
            <Avatar imgPath={props.user.avatar}></Avatar>
            {props.user.username}
        </span>
    );

    return (
        <NavDropdown title={title} id='nav-dropdown'>
            {props.menu.map((menuItem) => {
                if (!menuItem.path) {
                    return null;
                }

                return (
                    <NavDropdown.Item
                        key={menuItem.title || menuItem.path}
                        as={Link}
                        href={menuItem.path}
                        className='navbar-item interactable dropdown-child'
                    >
                        {t(menuItem.title)}
                    </NavDropdown.Item>
                );
            })}
        </NavDropdown>
    );
};

export default ProfileMenu;
