const { PhoenixbornTypes } = require('../../constants');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const SimpleStep = require('./simplestep');

class BattleStep extends BaseStepWithPipeline {
    constructor(game, attack) {
        super(game);
        this.attack = attack;
        this.chosenBattle = null;
        let steps = [
            // prompt for battle
            new SimpleStep(this.game, () => this.chooseBattle())
        ];

        this.pipeline.initialise(steps);
    }

    chooseBattle() {
        const unresolvedBattles = this.attack.battles.filter((b) => b.resolved === false);
        if (unresolvedBattles.length === 0) {
            return true;
        }

        if (
            this.attack.isPBAttack &&
            this.attack.battles.length > 1 &&
            //TODO: convert this check to a strategy call, or handle in selectcardprompt
            !this.attack.attackingPlayer.isDummy
        ) {
            this.game.promptForSelect(this.attack.attackingPlayer, {
                activePromptTitle: 'Choose a fight to resolve',
                controller: 'self',
                cardCondition: (card) => unresolvedBattles.map((b) => b.attacker).includes(card),
                onSelect: (player, card) => {
                    this.setChosenBattle(unresolvedBattles.find((b) => b.attacker === card));
                    this.game.addMessage('> Resolving attack from {0}', this.chosenBattle.attacker);
                    return true;
                }
            });
        } else {
            this.setChosenBattle(unresolvedBattles[0]);
        }
    }

    setChosenBattle(battle) {
        this.chosenBattle = battle;
        this.queueStep(new SimpleStep(this.game, () => this.promptForCounter()));
        this.queueStep(new SimpleStep(this.game, () => this.resolveBattle()));
        this.queueStep(new SimpleStep(this.game, () => this.exhaustParticipants()));
        this.queueStep(
            new SimpleStep(this.game, () => this.game.saveReplayState('battle-resolved'))
        );
    }

    promptForCounter() {
        // battle.guard here holds a blocker or a guard
        if (this.chosenBattle.guard) {
            // if it's not a pb guard then counter - blockers always counter IF not exhausted
            this.chosenBattle.counter =
                !PhoenixbornTypes.includes(this.chosenBattle.guard.type) &&
                !this.chosenBattle.guard.exhausted;
            return true;
        }

        if (this.attack.isPBAttack || !this.chosenBattle.target || this.chosenBattle.target.exhausted) {
            // don't ask to counter with phoenixborn (they don't have an attack value)
            // don't ask if the target has been removed
            // and exhausted targets cannot counter
            this.chosenBattle.counter = false;
            return true;
        }

        // aspects will always counter because they are alert
        if (this.attack.defendingPlayer.isDummy) {
            this.chosenBattle.counter = true;
            return true;
            // }
        }

        this.game.promptWithHandlerMenu(this.attack.defendingPlayer, {
            activePromptTitle: 'Do you want to counter?',
            mode: 'select',
            choices: ['Yes', 'No'],
            handlers: [
                () => (this.chosenBattle.counter = true),
                () => (this.chosenBattle.counter = false)
            ]
        });
    }

    resolveBattle() {
        if (this.chosenBattle.target) {
            this.game.actions
                .resolveBattle({ battle: this.chosenBattle })
                .resolve(null, this.game.getFrameworkContext(this.game.activePlayer));
        } else {
            this.chosenBattle.resolved = true;
        }
    }

    exhaustParticipants() {
        let battle = this.chosenBattle;
        let participants = [battle.attacker];
        // if there's a guard or blocker, they MUST counter and so exhaust
        // Correction... they may have been exhausted mid fight
        // EXCEPTION! not if it's a phoenixborn - no counter or exhaust
        if (battle.guard && !PhoenixbornTypes.includes(battle.guard.type)) {
            if (
                battle.counter &&
                battle.guard.exhaustsOnCounter() &&
                !battle.attackerClone.isFeeble()
            ) {
                participants.push(battle.guard);
            }
        } else if (
            !this.attack.isPBAttack &&
            battle.counter &&
            battle.target &&
            battle.target.exhaustsOnCounter() &&
            !battle.attackerClone.isFeeble()
        ) {
            // otherwise if the target counters (was not guarded or blocked) they exhaust
            participants.push(battle.target);
        }

        // phoenixborn don't exhaust, but are marked as having guarded this round
        if (battle.guard && PhoenixbornTypes.includes(battle.guard.type)) {
            this.game.actions
                .setGuarded()
                .resolve(battle.guard, this.game.getFrameworkContext(this.game.activePlayer));
        }

        this.game.actions
            .exhaust()
            .resolve(participants, this.game.getFrameworkContext(this.game.activePlayer));
    }
}

module.exports = BattleStep;
