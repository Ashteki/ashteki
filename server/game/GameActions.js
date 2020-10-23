const GameActions = require('./GameActions/index');

const Actions = {
    // card actionsa
    addPowerCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'power'),
    addDamageToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'damage'),
    addExhaustionToken: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'exhaustion'),
    addStatusToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'status'),
    addDisruptionCounter: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'disruption'),
    addDoomCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'doom'),
    addFuseCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'fuse'),
    addGloryCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'glory'),
    addGrowthCounter: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'growth'),
    addSchemeCounter: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'scheme'),
    addWardToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'ward'),
    addWarrantCounter: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'warrant'),
    archive: (propertyFactory) => new GameActions.ArchiveAction(propertyFactory),
    attach: (propertyFactory) => new GameActions.AttachAction(propertyFactory), // upgrade
    attachDie: (propertyFactory) => new GameActions.AttachDieAction(propertyFactory), // upgradeDie
    detachDie: (propertyFactory) => new GameActions.DetachDieAction(propertyFactory), // die, card
    capture: (propertyFactory) => new GameActions.CaptureAction(propertyFactory),
    cardLastingEffect: (propertyFactory) =>
        new GameActions.LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    clearGrowthTokens: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'growth'),
    clearGloryCounters: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'glory'),
    dealDamage: (propertyFactory) => new GameActions.DealDamageAction(propertyFactory),
    delayedEffect: (propertyFactory) => new GameActions.DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discard: (propertyFactory) => new GameActions.DiscardCardAction(propertyFactory),
    destroy: (propertyFactory) => new GameActions.DestroyAction(propertyFactory),
    exalt: (propertyFactory) => new GameActions.ExaltAction(propertyFactory), // amount = 1
    exhaust: (propertyFactory) => new GameActions.ExhaustAction(propertyFactory),
    graft: (propertyFactory) => new GameActions.PlaceUnderAction(propertyFactory, true),
    heal: (propertyFactory) => new GameActions.HealAction(propertyFactory),
    moveCard: (propertyFactory) => new GameActions.MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false
    moveOnBattleline: (propertyFactory) => new GameActions.MoveOnBattlelineAction(propertyFactory),
    moveToBottom: (propertyFactory) => new GameActions.MoveToBottomAction(propertyFactory),
    moveToFlank: (propertyFactory) => new GameActions.MoveToFlankAction(propertyFactory),
    placeUnder: (propertyFactory) => new GameActions.PlaceUnderAction(propertyFactory), // parent
    playCard: (propertyFactory) => new GameActions.PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    purge: (propertyFactory) => new GameActions.PurgeAction(propertyFactory),
    putIntoPlay: (propertyFactory) => new GameActions.PutIntoPlayAction(propertyFactory),
    ready: (propertyFactory) => new GameActions.ReadyAction(propertyFactory),
    rearrangeBattleline: (propertyFactory) =>
        new GameActions.RearrangeBattlelineAction(propertyFactory),
    recoverWounds: (propertyFactory) => new GameActions.RecoverAction(propertyFactory),
    removeDamage: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'damage'),
    removeStatus: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'status'),
    removePowerCounter: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory),
    removeSchemeCounter: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'scheme'),
    removeWard: (propertyFactory) => new GameActions.RemoveWardAction(propertyFactory),
    removeWardToken: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'ward'),
    removeWarrantCounter: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'warrant'),
    resolveAbility: (propertyFactory) => new GameActions.ResolveAbilityAction(propertyFactory), // ability
    resolveFight: (propertyFactory) => new GameActions.ResolveFightAction(propertyFactory), // this shouldn't normally be needed
    returnToDeck: (propertyFactory) => new GameActions.ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new GameActions.ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new GameActions.RevealAction(propertyFactory),
    sacrifice: (propertyFactory) => new GameActions.DestroyAction(propertyFactory, true),
    swap: (propertyFactory) => new GameActions.SwapAction(propertyFactory), // origin
    use: (propertyFactory) => new GameActions.UseAction(propertyFactory),
    ward: (propertyFactory) => new GameActions.WardAction(propertyFactory),
    // player actions
    archiveAtRandom: (propertyFactory) => new GameActions.RandomArchiveAction(propertyFactory), // amount = 1
    chosenDiscard: (propertyFactory) => new GameActions.ChosenDiscardAction(propertyFactory), // amount = 1
    discardAtRandom: (propertyFactory) => new GameActions.RandomDiscardAction(propertyFactory), // amount = 1
    discardTopOfDeck: (propertyFactory) => new GameActions.DiscardTopOfDeckAction(propertyFactory), // amount = 1
    purgeAtRandom: (propertyFactory) => new GameActions.RandomPurgeAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new GameActions.DrawAction(propertyFactory), // amount = 1
    forRemainderOfTurn: (propertyFactory) =>
        new GameActions.LastingEffectAction(propertyFactory, 1),
    untilNextTurn: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory, 2),
    untilEndOfMyNextTurn: (propertyFactory) =>
        new GameActions.LastingEffectAction(propertyFactory, 3),
    lastingEffect: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory),
    rearrangeCards: (propertFactory) => new GameActions.RearrangeCardsAction(propertFactory),
    search: (propertyFactory) => new GameActions.SearchAction(propertyFactory), // name
    shuffleDeck: (propertyFactory) => new GameActions.ShuffleDeckAction(propertyFactory), // name
    steal: (propertyFactory) => new GameActions.StealAction(propertyFactory), // amount = 1
    // meta actions
    addEventToWindow: (propertyFactory) => new GameActions.AddEventToWindowAction(propertyFactory),
    allocateDamage: (propertyFactory) => new GameActions.AllocateDamageAction(propertyFactory),
    changeEvent: (propertyFactory) => new GameActions.ChangeEventAction(propertyFactory),
    chooseAction: (propertyFactory) => new GameActions.ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    conditional: (propertyFactory) => new GameActions.ConditionalAction(propertyFactory),
    jointAction: (gameActions) => new GameActions.JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequential: (gameActions) => new GameActions.SequentialAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequentialForEach: (propertyFactory) =>
        new GameActions.SequentialForEachAction(propertyFactory),
    spendMainAction: (propertyFactory) => new GameActions.SpendMainAction(propertyFactory),
    spendSideAction: (propertyFactory) => new GameActions.SpendSideAction(propertyFactory),
    exhaustDie: (propertyFactory) => new GameActions.ExhaustDieAction(propertyFactory),
    setDieLevel: (propertyFactory) => new GameActions.SetDieLevelAction(propertyFactory),
    meditate: (propertyFactory) => new GameActions.MeditateAction(propertyFactory),
    lowerDie: (propertyFactory) => new GameActions.ChangeDieAction(propertyFactory, 'lower'),
    raiseDie: (propertyFactory) => new GameActions.ChangeDieAction(propertyFactory, 'raise')
};

module.exports = Actions;
