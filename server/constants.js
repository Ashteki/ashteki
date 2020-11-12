class Constants {}

Object.freeze(Constants);

const CardType = {
    Upgrade: 'Alteration Spell',
    Phoenixborn: 'Phoenixborn',
    ActionSpell: 'Action Spell',
    ReactionSpell: 'Reaction Spell'
};

const BattlefieldTypes = ['Ally', 'Conjuration'];

const AbilityType = {
    Action: 'action',
    WouldInterrupt: 'cancelinterrupt',
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

module.exports = { Constants, CardType, BattlefieldTypes, AbilityType, Magic, Level };
