class Constants {}

Object.freeze(Constants);

const CardType = {
    Upgrade: 'Alteration Spell',
    Phoenixborn: 'Phoenixborn',
    ActionSpell: 'Action Spell',
    ReactionSpell: 'Reaction Spell',
    ReadySpell: 'Ready Spell',
    Ally: 'Ally'
};

const Location = {
    Deck: 'deck',
    Hand: 'hand',
    Archives: 'archives',
    Discard: 'discard'
};

const BattlefieldTypes = ['Ally', 'Conjuration'];
const EffectLocations = ['play area', 'spellboard'];

const AbilityType = {
    Action: 'action', // not used
    WouldInterrupt: 'cancelinterrupt', // not used
    ForcedInterrupt: 'forcedinterrupt',
    Interrupt: 'interrupt',
    ForcedReaction: 'forcedreaction',
    Reaction: 'reaction',
    Persistent: 'persistent',
    OtherEffects: 'OtherEffects'
};

const Magic = {
    Ceremonial: 'ceremonial',
    Charm: 'charm',
    Divine: 'divine',
    Illusion: 'illusion',
    Natural: 'natural',
    Sympathy: 'sympathy',
    Time: 'time'
};

const Level = {
    Basic: 'basic',
    Class: 'class',
    Power: 'power'
};

module.exports = {
    Constants,
    CardType,
    Location,
    BattlefieldTypes,
    AbilityType,
    Magic,
    Level,
    EffectLocations
};
