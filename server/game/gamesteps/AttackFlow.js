const { BattlefieldTypes, CardType } = require('../../constants');
const { Costs } = require('../costs');
const AttackState = require('./AttackState');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const BattleStep = require('./BattleStep');
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
            new ChooseDefendersPrompt(this.game, this.attack),

            new SimpleStep(this.game, () => {
                this.attack.battles.forEach(() => {
                    this.queueStep(new BattleStep(this.game, this.attack));
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
            battle.target.isDefender = false;
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
                            counter: false,
                            resolved: false
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
