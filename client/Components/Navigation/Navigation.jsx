import React from 'react';
import { Navbar, Nav, NavDropdown, NavbarBrand } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Link from './Link';
import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import ProfileDropdown from './ProfileDropdown';
import ServerStatus from './ServerStatus';
import GameContextMenu from './GameContextMenu';

import './Navigation.scss';
import GameCountMenu from './GameCountMenu';
import LobbyUserCount from './LobbyUserCount';

/**
 * @typedef { import('../../menus').MenuItem } MenuItem
 */

/**
 * @typedef NavigationProps
 * @property {string} appName The name of the application, displayed on the left hand side of the navbar
 * @property {User} user The currently logged in user
 */

/**
 * @param {NavigationProps} props
 */
const Navigation = (props) => {
    const { t } = useTranslation();
    const { currentGame, lobbyResponse, lobbySocketConnected, lobbySocketConnecting } = useSelector(
        (state) => ({
            games: state.lobby.games,
            currentGame: state.lobby.currentGame,
            lobbyResponse: state.lobby.responseTime,
            lobbySocketConnected: state.lobby.connected,
            lobbySocketConnecting: state.lobby.connecting
        })
    );
    const { gameConnected, gameConnecting, gameResponse } = useSelector((state) => ({
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        gameResponse: state.games.responseTime
    }));

    /**
     * @param {MenuItem} menuItem The menu item
     * @param {User} user The logged in user
     * @returns {boolean} Whether or not the user can see this menu item
     */
    const userCanSeeMenu = (menuItem, user) => {
        // no permission required
        if (!menuItem.permission) {
            return true;
        }
        if (!user?.permissions) {
            return false;
        }

        return !!user.permissions[menuItem.permission];
    };

    /**
     * Filter a list of menu items to what the logged in user can see
     * @param {MenuItem[]} menuItems The list of menu items
     * @param {User} user The logged in user
     * @returns {MenuItem[]} The filtered menu items
     */
    const filterMenuItems = (menuItems, user) => {
        const returnedItems = [];

        for (const menuItem of menuItems) {
            if (user && menuItem.showOnlyWhenLoggedOut) {
                continue;
            }

            if (!user && menuItem.showOnlyWhenLoggedIn) {
                continue;
            }

            if (!userCanSeeMenu(menuItem, user)) {
                continue;
            }

            returnedItems.push(menuItem);
        }

        return returnedItems;
    };

    /**
     * Render a list of menu items to react components
     * @param {MenuItem[]} menuItems The menu items
     * @returns {JSX.Element[]} The list of rendered menu items
     */
    const renderMenuItems = (menuItems) => {
        return filterMenuItems(menuItems, props.user).map((menuItem) => {
            const children =
                menuItem.childItems && filterMenuItems(menuItem.childItems, props.user);
            if (children && children.length > 0) {
                return (
                    <NavDropdown
                        key={menuItem.title}
                        title={t(menuItem.title)}
                        id={`nav-${menuItem.title}`}
                    >
                        {children.map((menuItem) => {
                            if (!menuItem.path) {
                                return <></>;
                            }

                            return (
                                <Link key={menuItem.path} href={menuItem.path}>
                                    <NavDropdown.Item>{t(menuItem.title)}</NavDropdown.Item>
                                </Link>
                            );
                        })}
                    </NavDropdown>
                );
            }

            if (!menuItem.path) {
                return <></>;
            }

            return (
                <Nav.Link
                    key={menuItem.path || menuItem.title}
                    href={menuItem.path}
                    as={Link}
                    className={window.location.pathname === menuItem.path ? 'active' : ''}
                >
                    {menuItem.title}
                </Nav.Link>
            );
        });
    };

    return (
        <Navbar bg='dark' variant='dark' className='navbar-sm' fixed='top'>
            <Nav>
                <NavbarBrand href='/'>Ashteki</NavbarBrand>
                {renderMenuItems(LeftMenu)}
            </Nav>
            <Navbar.Collapse id='navbar' className='justify-content-end'>
                <Nav className='ml-auto pr-md-6'>
                    <GameContextMenu />
                    <GameCountMenu />
                    <LobbyUserCount />
                    {!currentGame && (
                        <ServerStatus
                            connected={lobbySocketConnected}
                            connecting={lobbySocketConnecting}
                            serverType='Lobby'
                            responseTime={lobbyResponse}
                        />
                    )}
                    {currentGame?.started && (
                        <ServerStatus
                            connected={gameConnected}
                            connecting={gameConnecting}
                            serverType='Game server'
                            responseTime={gameResponse}
                        />
                    )}
                    {renderMenuItems(RightMenu)}
                    <ProfileDropdown menu={ProfileMenu} user={props.user} />

                    <Nav.Link
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://www.patreon.com/ashteki'>
                        <span className='patreon-link'>Patreon</span>
                    </Nav.Link>
                </Nav>

            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
