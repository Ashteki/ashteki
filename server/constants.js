class Constants {}

Object.freeze(Constants);

const CardType = {
    Upgrade: 'Alteration Spell',
    Phoenixborn: 'Phoenixborn'
};

const BattlefieldTypes = ['Ally', 'Conjuration'];

module.exports = { Constants, CardType, BattlefieldTypes };
