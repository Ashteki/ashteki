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
    Chimera: 'Chimera'
};

const Location = {
    Deck: 'deck',
    Hand: 'hand',
    Archives: 'archives',
    Discard: 'discard',
    PlayArea: 'play area'
};

const BattlefieldTypes = [CardType.Ally, CardType.Conjuration, CardType.Aspect];
const PhoenixbornTypes = [CardType.Phoenixborn, CardType.Chimera];
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
    BattlefieldTypes,
    PhoenixbornTypes,
    UpgradeCardTypes,
    ConjuredCardTypes,
    AbilityType,
    Magic,
    Level,
    EffectLocations,
    BluffAbilityTypes,
    DamageDealingLocations,
    GameType
};
