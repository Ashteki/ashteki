const CannotRestriction = require('./Effects/cannotrestriction.js');
const CopyCard = require('./Effects/CopyCard');
const EffectBuilder = require('./Effects/EffectBuilder');
const GainAbility = require('./Effects/GainAbility');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    actionCardLocationAfterPlay: (location) =>
        EffectBuilder.card.static('actionCardLocationAfterPlay', location),
    addKeyword: (keyword) => EffectBuilder.card.static('addKeyword', keyword),
    addTrait: (trait) => EffectBuilder.card.static('addTrait', trait),
    blank: () => EffectBuilder.card.static('blank'),
    bonusDamage: (match) => EffectBuilder.card.static('bonusDamage', match),
    canPlayAsUpgrade: () => EffectBuilder.card.static('canPlayAsUpgrade'),
    cardCannot: (type, condition) =>
        EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(type, condition)),
    changeType: (type) => EffectBuilder.card.static('changeType', type),
    consideredAsFlank: () => EffectBuilder.card.static('consideredAsFlank'),
    copyCard: (card) => EffectBuilder.card.static('copyCard', new CopyCard(card)),
    customDetachedCard: (properties) => EffectBuilder.card.detached('customEffect', properties),
    doesNotReady: () => EffectBuilder.card.static('doesNotReady'),
    entersPlayReady: () => EffectBuilder.card.static('entersPlayReady'),
    visbileIn: (location) => EffectBuilder.card.static('visbileIn', location),
    gainAbility: (type, properties) =>
        EffectBuilder.card.static('gainAbility', new GainAbility(type, properties)),
    ignores: (trait) => EffectBuilder.card.static('ignores', trait),
    limitFightDamage: (amount) => EffectBuilder.card.flexible('limitFightDamage', amount),
    modifyPower: (amount) => EffectBuilder.card.flexible('modifyPower', amount),
    modifyAttack: (amount) => EffectBuilder.card.flexible('modifyAttack', amount),
    modifyLife: (amount) => EffectBuilder.card.flexible('modifyLife', amount),
    modifyArmor: (amount) => EffectBuilder.card.flexible('modifyArmor', amount),
    removeKeyword: (keyword) => EffectBuilder.card.static('removeKeyword', keyword),
    setPower: (amount) => EffectBuilder.card.flexible('setPower', amount),
    setAttack: (amount) => EffectBuilder.card.flexible('setAttack', amount),
    takeControl: (player) => EffectBuilder.card.static('takeControl', player),
    entersPlayUnderOpponentsControl: () =>
        EffectBuilder.card.static('entersPlayUnderOpponentsControl'),
    terminalCondition: (properties) =>
        EffectBuilder.card.detached('terminalCondition', {
            apply: (card, context) => {
                properties.target = card;
                properties.context = properties.context || context;
                return context.source.terminalCondition(() => properties);
            },
            unapply: (card, context, effect) =>
                context.game.effectEngine.removeTerminalCondition(effect)
        }),
    transferDamage: (card) => EffectBuilder.card.static('transferDamage', card),
    // Player effects
    lastingAbilityTrigger: (properties) =>
        EffectBuilder.player.detached('abilityTrigger', {
            apply: (player, context) => {
                let ability = context.source.triggeredAbility(
                    'reaction',
                    Object.assign({ printedAbility: false, player: player }, properties)
                );
                ability.registerEvents();
                return ability;
            },
            unapply: (player, context, ability) => ability.unregisterEvents()
        }),
    additionalCost: (costFactory) => EffectBuilder.player.static('additionalCost', costFactory),
    canFight: (match) =>
        EffectBuilder.player.static(
            'canUse',
            (context) =>
                context.ability.title === 'Fight with this creature' &&
                match(context.source, context)
        ),
    mustFightIfAble: () => EffectBuilder.card.static('mustFightIfAble'),
    canPlay: (match) => EffectBuilder.player.static('canPlay', match),
    canPlayFromOwn: (location) =>
        EffectBuilder.player.detached('canPlayFromOwn', {
            apply: (player) => player.addPlayableLocation('play', player, location),
            unapply: (player, context, location) => player.removePlayableLocation(location)
        }),
    canUse: (match) =>
        EffectBuilder.player.static('canUse', (context) => match(context.source, context)),
    chooseCardsFromArchives: (card) => EffectBuilder.player.static('chooseCardsFromArchives', card),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached('customEffect', properties),
    delayedEffect: (properties) =>
        EffectBuilder.player.detached('delayedEffect', {
            apply: (player, context) => {
                properties.context = properties.context || context;
                return context.source.delayedEffect(() => properties);
            },
            unapply: (player, context, effect) =>
                context.game.effectEngine.removeDelayedEffect(effect)
        }),
    modifyKeyCost: (amount) => EffectBuilder.player.flexible('modifyKeyCost', amount),
    modifyHandSize: (amount) => EffectBuilder.player.flexible('modifyHandSize', amount),
    playerCannot: (type, condition) =>
        EffectBuilder.player.static('abilityRestrictions', new CannotRestriction(type, condition)),
    stealFromPool: () => EffectBuilder.player.static('stealFromPool'),
    captureFromPool: () => EffectBuilder.player.static('captureFromPool'),
    skipStep: (step) => EffectBuilder.player.static('skipStep', step),
    canGuard: () => EffectBuilder.player.static('canGuard')
};

module.exports = Effects;
