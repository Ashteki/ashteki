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

module.exports = { Constants, CardType, BattlefieldTypes, AbilityType };
