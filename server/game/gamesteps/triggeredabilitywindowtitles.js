const _ = require('underscore');
const { AbilityType, CardType, BattlefieldTypes } = require('../../constants');

const EventToTitleFunc = {
    onAttackersDeclared: () => 'attackers being declared',
    // onCardPlayed: (event) => event.card.name + ' being played',
    onCardEntersPlay: (event) => event.card.name + ' being played',
    onAbilityInitiated: GetTargettingTitlePhrase,
    onCardAbilityInitiated: (event) => 'the effects of ' + event.card.name,
    onDamageDealt: (event) =>
        event.card.name + ' receiving ' + event.amount + ' damage from ' + event.damageSource.name,
    onCardDestroyed: (event) => event.card.name + ' being destroyed',
    onCardLeavesPlay: (event) => event.card.name + ' leaving play',
    onMeditated: () => 'meditation'
    // ,
    // onPhaseEnded: (event) => event.phase + ' phase ending',
    // onPhaseStarted: (event) => event.phase + ' phase starting'
};

const AbilityTypeToWord = {
    cancelinterrupt: 'interrupt',
    interrupt: 'interrupt',
    reaction: 'reaction',
    forcedreaction: 'reaction',
    forcedinterrupt: 'interrupt',
    whenrevealed: 'when revealed'
};

function GetTargettingTitlePhrase(event, player) {
    let myEvent = event;
    //if (event.context.preThenEvent && event.context.preThenEvent.name !== 'unnamedEvent') { // original
    //if (event.context.preThenEvent && event.context.preThenEvent.name !== 'unnamedEvent' && event.context.preThenEvent.context.ability.abilityType === 'action') { //Update only for Song of Sorrow and similar card abilities
    //    myEvent = event.context.preThenEvent;
    //}
    const abilityTitle = myEvent.context.ability.title || myEvent.context.source.name;
    // are there any of the players units / pb to name drop
    let targetList = '';
    const targets = Object.values(myEvent.context.targets).filter(
        (t) => t.controller === player &&
            [CardType.Phoenixborn, ...BattlefieldTypes].includes(t.type)
    );
    if (targets && targets.length) {
        targetList = targets.length > 1
            ? ' targetting multiple units'
            : ' targetting ' + targets[0].name
    }
    return abilityTitle + targetList;
}
function FormatTitles(titles) {
    return _.reduce(
        titles,
        (string, title, index) => {
            if (index === 0) {
                return title;
            } else if (index === 1) {
                return title + ' or ' + string;
            }

            return title + ', ' + string;
        },
        ''
    );
}

const AbilityWindowTitles = {
    getTitle: function (abilityType, events, player) {
        if (!_.isArray(events)) {
            events = [events];
        }

        let abilityWord = 'Reaction'; // AbilityTypeToWord[abilityType] || abilityType;
        let titles = _.filter(
            _.map(events, (event) => {
                let func = EventToTitleFunc[event.name];
                if (func) {
                    return func(event, player);
                }
            }),
            (string) => string
        );

        if ([AbilityType.ForcedReaction, AbilityType.ForcedInterrupt].includes(abilityType)) {
            if (titles.length > 0) {
                return 'Choose ' + abilityWord + ' order for ' + FormatTitles(titles);
            }

            return 'Choose ' + abilityWord + ' order';
        }

        if (titles.length > 0) {
            return 'Any ' + abilityWord + 's to ' + FormatTitles(titles) + '?';
        }

        return 'Any ' + abilityWord + 's?';
    },
    getAction: function (event) {
        let func = EventToTitleFunc[event.name];
        if (func) {
            return func(event);
        }

        return event.name;
    }
};

module.exports = AbilityWindowTitles;
