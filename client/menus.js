/**
 * @typedef MenuItem
 * @property {string} [path] The url path
 * @property {string} title The title to show to the user
 * @property {boolean} [showOnlyWhenLoggedIn] Whether or not this menu item only shows for logged in users
 * @property {boolean} [showOnlyWhenLoggedOut] Whether or not this menu item only shows for logged out users
 * @property {Permission} [permission] The permission required to see this menu item
 * @property {MenuItem[]} [childItems] Child menu items
 */

/**
 * @type {MenuItem[]} The list of menu items for the left side menu
 */
export const LeftMenu = [
    { path: '/', title: 'Play' },
    { path: '/cards', title: 'Cards', showOnlyWhenLoggedIn: false },
    { path: '/decks', title: 'Decks', showOnlyWhenLoggedIn: true },
    { path: '/results', title: 'Results', showOnlyWhenLoggedIn: true },
    { path: '/faq', title: 'Help' },
    {
        title: 'Admin',
        showOnlyWhenLoggedIn: true,
        childItems: [
            { path: '/users', title: 'Users', permission: 'canManageUsers' },
            { path: '/nodes', title: 'Nodes', permission: 'canManageNodes' },
            { path: '/banlist', title: 'Ban List', permission: 'canManageBanlist' },
            { path: '/taggedgames', title: 'Tagged Games', permission: 'canManageTournaments' }
        ]
    }
];

/**
 * @type {MenuItem[]} The list of menu items for the right side menu
 */
export const RightMenu = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true, position: 'right' }
];

/**
 * @type {MenuItem[]} The menu items that appear in the profile menu
 */
export const ProfileMenu = [
    { title: 'Profile', path: '/profile' },
    // { title: 'Security', path: '/security' },
    // { title: 'Block List', path: '/blocklist' },
    { title: 'Logout', path: '/logout' }
];
