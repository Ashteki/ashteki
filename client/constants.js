export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

export const MagicTypes = [
    'ceremonial',
    'charm',
    'divine',
    'illusion',
    'natural',
    'sympathy',
    'time'
];

export const UpgradeCardTypes = ['Alteration Spell', 'Conjured Alteration Spell'];

export const PatreonClientId = 'kPREwt5MsRP3lK0rsqLitscg7A9o5hn-bkbzELmHIcgo4C80TPARfUWe3rjXIqOh';
const callbackUrl = 'https://ashteki.com/patreon';//`${window.location.origin}/patreon`;
export const patreonUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${PatreonClientId}&redirect_uri=${callbackUrl}`;

