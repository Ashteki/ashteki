export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

export const Constants = {
    Expansions: [
        { value: '341', label: 'CotA' },
        { value: '435', label: 'AoA' },
        { value: '452', label: 'WC' },
        { value: '479', label: 'MM' }
    ],
    SetIconPaths: {},
    IdBackBlanksPaths: {},
    MaverickIcon: require('./assets/img/maverick.png'),
    AnomalyIcon: require('./assets/img/anomaly.png'),
    DefaultCard: require('./assets/img/idbacks/identity.jpg')
};

for (let expansion of Constants.Expansions) {
    Constants.SetIconPaths[
        expansion.value
    ] = require(`./assets/img/idbacks/${expansion.value}.png`);
}

for (let x = 1; x < 8; x++) {
    Constants.IdBackBlanksPaths[
        x
    ] = require(`./assets/img/idbacks/idback_blanks/cardback_${x}.png`);
}

export const PatreonClientId = 'HjDP9KKd-HscTXXMs_2TNl2h_POjaEw7D-EkLv_ShRbarVO_WuKA0LWRBp9LRdLq';
