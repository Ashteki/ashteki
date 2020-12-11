const { BattlefieldTypes, CardType } = require('../../constants');
const { Costs } = require('../costs');
const AttackState = require('./AttackState');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const ChooseDefendersPrompt = require('./ChooseDefendersPrompt');
const SimpleStep = require('./simplestep');

class AttackFlow extends BaseStepWithPipeline {
    constructor(game, target = null) {
        super(game);
        this.target = target;
        this.isPBAttack = target.type === CardType.Phoenixborn;
        this.attackingPlayer = this.game.activePlayer;
        this.defendingPlayer = target.controller;
        game.setAttackState(new AttackState(this.target, this.attackingPlayer));

        let steps = [];
        steps = steps.concat([
            new SimpleStep(this.game, () => this.declareAttackers()),
            new SimpleStep(this.game, () => this.payAttackCost(this.attackingPlayer)),
            // should choose blockers here as a player prompt
            new ChooseDefendersPrompt(this.game, this.attack),
            new SimpleStep(this.game, () => {
                this.attack.battles.forEach((battle) => {
                    // this.game.queueSimpleStep(() => this.chooseBlockOrGuard(battle));
                    // the rest are fight resolution
                    this.game.queueSimpleStep(() => this.promptForCounter(battle));
                    this.game.queueSimpleStep(() => this.resolveBattle(battle));
                    this.game.queueSimpleStep(() => this.exhaustParticipants(battle));
                });
            }),
            new SimpleStep(this.game, () => this.clearAttackStatuses())
        ]);

        this.pipeline.initialise(steps);
    }

    get attack() {
        return this.game.attackState;
    }

    clearAttackStatuses() {
        this.attack.battles.forEach((battle) => {
            battle.attacker.isAttacker = false;
            if (battle.guard) battle.guard.isDefender = false;
        });
        this.game.clearAttackState();
    }

    payAttackCost(attackingPlayer) {
        let attackers = this.attack.battles.map((b) => b.attacker);
        this.game.addAlert(
            'danger',
            '{0} attacks {1} with {2}',
            attackingPlayer,
            this.target,
            attackers
        );

        const costEvent = Costs.mainAction().payEvent(
            this.game.getFrameworkContext(attackingPlayer)
        );
        this.game.openEventWindow(costEvent);
    }

    exhaustParticipants(battle) {
        let participants = [battle.attacker];
        // if there's a guard or blocker, they counter and so exhaust
        // otherwise if the target counters (was not guarded or blocked) they exhaust
        if (
            battle.guard &&
            battle.guard.type !== CardType.Phoenixborn &&
            battle.guard.exhaustsOnCounter()
        ) {
            participants.push(battle.guard);
        } else if (battle.counter && battle.target.exhaustsOnCounter()) {
            participants.push(battle.target);
        }
        // phoenixborn don't exhaust, but are marked as having guarded this round
        if (battle.guard && battle.guard.type === CardType.Phoenixborn) {
            this.game.actions
                .setGuarded()
                .resolve(battle.guard, this.game.getFrameworkContext(this.game.activePlayer));
        }

        this.game.actions
            .exhaust()
            .resolve(participants, this.game.getFrameworkContext(this.game.activePlayer));
    }

    resolveBattle(battle) {
        this.game.actions
            .resolveBattle({ battle: battle })
            .resolve(null, this.game.getFrameworkContext(this.game.activePlayer));
    }

    blockersAvailable(battle) {
        return this.defendingPlayer.defenders.some((c) => this.availableToBlockOrGuard(c, battle));
    }

    availableToBlockOrGuard(c, battle) {
        return (
            this.guardTest(c, battle.target, battle.attacker) || this.blockTest(c, battle.attacker)
        );
    }

    guardTest(card, target, attacker) {
        return !this.isPBAttack && card.canGuard(attacker) && card !== target;
    }

    blockTest(card, attacker) {
        return (
            this.isPBAttack &&
            !this.attack.battles.some((b) => b.guard == card) &&
            card.canBlock(attacker)
        );
    }

    promptForCounter(battle) {
        // battle.guard here holds a blocker or a guard
        if (battle.guard) {
            // if it's not a pb guard then counter
            battle.counter = battle.guard.type !== CardType.Phoenixborn;
            return true;
        }

        if (this.isPBAttack || battle.target.exhausted) {
            // don't ask to counter with phoenixborn (they don't have an attack value)
            // and exhausted targets cannot counter
            battle.counter = false;
            return true;
        }

        this.game.promptWithHandlerMenu(this.defendingPlayer, {
            activePromptTitle: 'Do you want to counter?',
            mode: 'select',
            choices: ['Yes', 'No'],
            handlers: [() => (battle.counter = true), () => (battle.counter = false)]
        });
    }

    declareAttackers() {
        const params = {
            attackingPlayer: this.attackingPlayer,
            battles: this.attack.battles
        };
        let event = this.game.getEvent('onAttackersDeclared', params, () => {
            this.game.promptForSelect(this.attackingPlayer, {
                activePromptTitle: this.isPBAttack ? 'Select attackers' : 'Select an attacker',
                source: this.target,
                controller: 'self',
                cardType: [...BattlefieldTypes],
                cardCondition: (card) => !card.exhausted,
                mode: this.isPBAttack ? 'unlimited' : 'single',
                onSelect: (player, card) => {
                    let cards;
                    if (Array.isArray(card)) {
                        cards = card;
                    } else {
                        cards = [card];
                    }
                    cards.forEach((c) => {
                        this.attack.battles.push({
                            attacker: c,
                            target: this.target,
                            guard: null,
                            counter: false
                        });
                        c.isAttacker = true;
                    });

                    return true;
                }
            });
        });
        this.game.openEventWindow([event]);
    }
}

module.exports = AttackFlow;
