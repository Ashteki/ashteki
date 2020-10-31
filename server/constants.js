class Constants {}

Object.freeze(Constants);

const CardType = {
    Upgrade: 'Alteration Spell',
    Phoenixborn: 'Phoenixborn',
    ReactionSpell: 'Reaction Spell'
};

const BattlefieldTypes = ['Ally', 'Conjuration'];

module.exports = { Constants, CardType, BattlefieldTypes };
