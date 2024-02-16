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
    ConjuredAlteration: 'Conjured Alteration Spell',
    Aspect: 'Aspect',
    ConjuredAspect: 'Conjured Aspect',
    Chimera: 'Chimera',
    Behaviour: 'Behaviour'
};

const Location = {
    Deck: 'deck',
    Hand: 'hand',
    Archives: 'archives',
    Discard: 'discard',
    PlayArea: 'play area'
};

const ActionSpellTypes = [CardType.ActionSpell, CardType.ReactionSpell];
const BattlefieldTypes = [
    CardType.Ally,
    CardType.Conjuration,
    CardType.Aspect,
    CardType.ConjuredAspect
];
const AspectTypes = [CardType.Aspect, CardType.ConjuredAspect];
const PhoenixbornTypes = [CardType.Phoenixborn, CardType.Chimera];
const UpgradeCardTypes = [CardType.Upgrade, CardType.ConjuredAlteration];
const ConjuredCardTypes = [
    CardType.Conjuration,
    CardType.ConjuredAlteration,
    CardType.ConjuredAspect
];
const EffectLocations = ['play area', 'spellboard'];
const DamageDealingLocations = ['play area', 'being played', 'spellboard'];
const FaceUpLocations = [
    'play area',
    'spellboard',
    'discard',
    'hand',
    'purged',
    'grafted',
    'archives'
];

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
    Time: 'time',
    Rage: 'rage'
};

const Level = {
    Basic: 'basic',
    Class: 'class',
    Power: 'power'
};

const GameType = {
    Casual: 'casual',
    Competitive: 'competitive'
};

module.exports = {
    Constants,
    CardType,
    Location,
    ActionSpellTypes,
    BattlefieldTypes,
    PhoenixbornTypes,
    UpgradeCardTypes,
    ConjuredCardTypes,
    AspectTypes,
    AbilityType,
    Magic,
    Level,
    EffectLocations,
    BluffAbilityTypes,
    DamageDealingLocations,
    FaceUpLocations,
    GameType
};
