const PlayerAction = require('./PlayerAction');

class ChangeDiceAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.name = 'changeDice';
        this.eventName = 'onChangeDice';
        this.effect = 'changes dice';
        this.singleLevel = false;
        this.cycleLevels = true;
    }

    setDefaultProperties() {
        this.numDice = 1;
        this.owner = 'self';
        this.dieCondition = undefined;
        this.unexhaust = false;
    }

    defaultTargets(context) {
        return [context.player];
    }

    getEvent(player, context) {
        if (!player.checkRestrictions('diceChange', context)) {
            return;
        }

        const params = {
            player: player,
            context: context,
            numDice: this.numDice,
            owner: this.owner,
            cycleLevels: this.cycleLevels,
            singleLevel: this.singleLevel,
            sort: true,
            preventAuto: true,
            dieCondition: this.dieCondition,
            unexhaust: this.unexhaust
        };
        return super.createEvent('onChangeDice', params, (event) => {
            let playerPhrase = ' of your';
            playerPhrase += this.unexhaust ? ' exhausted dice' : ' dice'; // self by default
            if (event.owner === 'opponent') {
                playerPhrase = " of your opponent's dice";
            } else if (event.owner === 'any') {
                playerPhrase = " of any player's dice";
            }
            const props = Object.assign(
                {
                    onSelect: (player, dice) => {
                        if (!context.changedDice) {
                            context.changedDice = [];
                        }
                        context.changedDice.push(dice);
                        context.game.addMessage('{0} changes dice levels: {1}', player, dice);
                        return true;
                    },
                    activePromptTitle:
                        'Change ' +
                        event.numDice +
                        playerPhrase +
                        '. Click a die again to change its magic level'
                },
                params
            );
            context.game.promptForDiceChange(event.player, props);
        });
    }
}
module.exports = ChangeDiceAction;
