const GameActions = require('./GameActions/index');

const Actions = {
    // card actions
    addDamageToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'damage'),
    addExhaustionToken: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'exhaustion'),
    addGravityFluxToken: (propertyFactory) =>
        new GameActions.AddTokenAction(propertyFactory, 'gravityFlux'),
    addStatusToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'status'),
    addToken: (propertyFactory, type) => new GameActions.AddTokenAction(propertyFactory, type),
    attach: (propertyFactory) => new GameActions.AttachAction(propertyFactory), // upgrade
    attachConjuredAlteration: (propertyFactory) =>
        new GameActions.AttachConjuredAlterationAction(propertyFactory), // upgrade
    attachToPb: (propertyFactory) => new GameActions.AttachToPbAction(propertyFactory), // upgrade
    attachDie: (propertyFactory) => new GameActions.AttachDieAction(propertyFactory), // upgradeDie
    cardLastingEffect: (propertyFactory) =>
        new GameActions.LastingEffectCardAction(propertyFactory), // effect, targetLocation, condition, until
    dealDamage: (propertyFactory) => new GameActions.DealDamageAction(propertyFactory),
    delayedEffect: (propertyFactory) => new GameActions.DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    destroy: (propertyFactory) => new GameActions.DestroyAction(propertyFactory),
    detachDie: (propertyFactory) => new GameActions.DetachDieAction(propertyFactory), // die, card
    discard: (propertyFactory) => new GameActions.DiscardCardAction(propertyFactory),
    exhaust: (propertyFactory) => new GameActions.ExhaustAction(propertyFactory),
    exhaustGravityFlux: (propertyFactory) =>
        new GameActions.ExhaustGravityFluxAction(propertyFactory),
    heal: (propertyFactory) => new GameActions.HealAction(propertyFactory), // unused - removeDamage is used instead
    moveCard: (propertyFactory) => new GameActions.MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false
    moveToBottom: (propertyFactory) => new GameActions.MoveToBottomAction(propertyFactory),
    moveToken: (propertyFactory) => new GameActions.MoveTokenAction(propertyFactory),
    placeUnder: (propertyFactory) => new GameActions.PlaceUnderAction(propertyFactory), // parent
    playCard: (propertyFactory) => new GameActions.PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    purge: (propertyFactory) => new GameActions.PurgeAction(propertyFactory),
    putIntoPlay: (propertyFactory) => new GameActions.PutIntoPlayAction(propertyFactory),
    ready: (propertyFactory) => new GameActions.ReadyAction(propertyFactory),
    recoverWounds: (propertyFactory) => new GameActions.RecoverAction(propertyFactory),
    removeAllTokens: (propertyFactory) => new GameActions.RemoveAllTokensAction(propertyFactory),
    removeDamage: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'damage'),
    removeExhaustion: (propertyFactory) =>
        new GameActions.RemoveTokenAction(propertyFactory, 'exhaustion'),
    removeFromBattle: (propertyFactory) => new GameActions.RemoveFromBattleAction(propertyFactory),
    removeStatus: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'status'),
    removeToken: (propertyFactory, type) =>
        new GameActions.RemoveTokenAction(propertyFactory, type),
    resolveAbility: (propertyFactory) => new GameActions.ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory) => new GameActions.ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new GameActions.ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new GameActions.RevealAction(propertyFactory),
    sacrifice: (propertyFactory) => new GameActions.DestroyAction(propertyFactory, true),
    setGuarded: (propertyFactory) => new GameActions.SetGuardedAction(propertyFactory),
    use: (propertyFactory) => new GameActions.UseAction(propertyFactory),
    orderedAoE: (propertyFactory) => new GameActions.OrderedAoEAction(propertyFactory),

    // dice actions
    changeDice: (propertyFactory) => new GameActions.ChangeDiceAction(propertyFactory),
    exhaustDie: (propertyFactory) => new GameActions.ExhaustDieAction(propertyFactory),
    lowerDie: (propertyFactory) => new GameActions.ChangeDieAction(propertyFactory, 'lower'),
    raiseDie: (propertyFactory) => new GameActions.ChangeDieAction(propertyFactory, 'raise'),
    readyDie: (propertyFactory) => new GameActions.ReadyDieAction(propertyFactory),
    rerollDice: (propertyFactory) => new GameActions.RerollDiceAction(propertyFactory),
    rerollDie: (propertyFactory) => new GameActions.RerollDieAction(propertyFactory),
    resolveDieAbility: (propertyFactory) =>
        new GameActions.ResolveDieAbilityAction(propertyFactory),
    setDieLevel: (propertyFactory) => new GameActions.SetDieLevelAction(propertyFactory),
    useDie: (propertyFactory) => new GameActions.UseDieAction(propertyFactory),

    // player actions
    addSideAction: (propertyFactory) => new GameActions.AddSideAction(propertyFactory),
    chosenAmountDraw: (propertyFactory) => new GameActions.ChosenAmountDrawAction(propertyFactory),
    chosenDestroy: (propertyFactory) => new GameActions.ChosenDestroyAction(propertyFactory),
    chosenDiscard: (propertyFactory) => new GameActions.ChosenDiscardAction(propertyFactory), // amount = 1
    chosenExhaust: (propertyFactory) => new GameActions.ChosenExhaustAction(propertyFactory), // amount = 1
    discardAtRandom: (propertyFactory) => new GameActions.RandomDiscardAction(propertyFactory), // amount = 1
    discardTopOfDeck: (propertyFactory) => new GameActions.DiscardTopOfDeckAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new GameActions.DrawAction(propertyFactory), // amount = 1
    filterDeck: (propertyFactory) => new GameActions.FilterDeckAction(propertyFactory),
    forRemainderOfTurn: (propertyFactory) =>
        new GameActions.LastingEffectAction(propertyFactory, 1),
    lastingEffect: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory),
    meditate: (propertyFactory) => new GameActions.MeditateAction(propertyFactory),
    playerChosenAmountDraw: (propertyFactory) =>
        new GameActions.PlayerChosenAmountDrawAction(propertyFactory),
    purgeAtRandom: (propertyFactory) => new GameActions.RandomPurgeAction(propertyFactory), // amount = 1
    rearrangeCards: (propertyFactory) => new GameActions.RearrangeCardsAction(propertyFactory),
    search: (propertyFactory) => new GameActions.SearchAction(propertyFactory), // name
    shuffleDeck: (propertyFactory) => new GameActions.ShuffleDeckAction(propertyFactory), // name
    spendMainAction: (propertyFactory) => new GameActions.SpendMainAction(propertyFactory),
    spendSideAction: (propertyFactory) => new GameActions.SpendSideAction(propertyFactory),
    summon: (propertyFactory) => new GameActions.SummonAction(propertyFactory),

    // meta actions
    addEventToWindow: (propertyFactory) => new GameActions.AddEventToWindowAction(propertyFactory),
    allocateDamage: (propertyFactory) => new GameActions.AllocateDamageAction(propertyFactory),
    changeEvent: (propertyFactory) => new GameActions.ChangeEventAction(propertyFactory),
    chooseAction: (propertyFactory) => new GameActions.ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    conditional: (propertyFactory) => new GameActions.ConditionalAction(propertyFactory),
    jointAction: (gameActions) => new GameActions.JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    preventDamage: (propertyFactory) => new GameActions.PreventDamageAction(propertyFactory),
    resolveBattle: (propertyFactory) => new GameActions.ResolveBattleAction(propertyFactory), // battle
    sequential: (gameActions) => new GameActions.SequentialAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequentialForEach: (propertyFactory) => new GameActions.SequentialForEachAction(propertyFactory)
};

module.exports = Actions;
