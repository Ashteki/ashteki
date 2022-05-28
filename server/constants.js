class Constants { }

Object.freeze(Constants);

const CardType = {
    Upgrade: 'Alteration Spell',
    Phoenixborn: 'Phoenixborn',
    ActionSpell: 'Action Spell',
    ReactionSpell: 'Reaction Spell',
    ReadySpell: 'Ready Spell',
    Ally: 'Ally',
    Conjuration: 'Conjuration',
    ConjuredAlteration: 'Conjured Alteration Spell'
};

const Location = {
    Deck: 'deck',
    Hand: 'hand',
    Archives: 'archives',
    Discard: 'discard'
};

const BattlefieldTypes = [CardType.Ally, CardType.Conjuration];
const UpgradeCardTypes = [CardType.Upgrade, CardType.ConjuredAlteration];
const ConjuredCardTypes = [CardType.Conjuration, CardType.ConjuredAlteration];
const EffectLocations = ['play area', 'spellboard'];
const DamageDealingLocations = ['play area', 'being played', 'spellboard'];

const AbilityType = {
    Action: 'action', // not used
    WouldInterrupt: 'cancelinterrupt', // not used
    ForcedInterrupt: 'forcedInterrupt',
    Interrupt: 'interrupt',
    ForcedReaction: 'forcedReaction',
    Reaction: 'reaction',
    Persistent: 'persistent',
    OtherEffects: 'OtherEffects'
};
const BluffAbilityTypes = [AbilityType.Interrupt, AbilityType.Reaction];

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
    UpgradeCardTypes,
    ConjuredCardTypes,
    AbilityType,
    Magic,
    Level,
    EffectLocations,
    BluffAbilityTypes,
    DamageDealingLocations
};
