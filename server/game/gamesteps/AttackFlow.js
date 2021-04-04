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
                // will not queue if no attackers selected (no battles)
                this.attack.battles.forEach(() => {
                    this.queueStep(new BattleStep(this.game, this.attack));
                });
            }),
            // always tidy up
            new SimpleStep(this.game, () => this.clearAttackStatuses())
        ]);

        this.pipeline.initialise(steps);
    }

    get attack() {
        return this.game.attackState;
    }

    clearAttackStatuses() {
        this.attack.target.isDefender = false;
        this.attack.battles.forEach((battle) => {
            battle.attacker.isAttacker = false;
            battle.target.isDefender = false;
            if (battle.guard) battle.guard.isDefender = false;
        });
        this.game.clearAttackState();
    }

    payAttackCost(attackingPlayer) {
        let attackers = this.attack.battles.map((b) => b.attacker);
        if (attackers.length === 0) return;

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

    declareAttackers() {
        this.game.promptForSelect(this.attackingPlayer, {
            activePromptTitle: this.isPBAttack ? 'Select attackers' : 'Select an attacker',
            source: this.target,
            controller: 'self',
            cardType: BattlefieldTypes,
            cardCondition: (card) => !card.exhausted && card.checkRestrictions('attack'),
            mode: this.isPBAttack ? 'unlimited' : 'single',
            optional: true,
            onSelect: (player, card) => {
                let cards;
                if (Array.isArray(card)) {
                    cards = card;
                } else {
                    cards = [card];
                }
                if (cards.length > 0) {
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
                    const params = {
                        attackingPlayer: this.attackingPlayer,
                        battles: this.attack.battles
                    };
                    this.game.raiseEvent('onAttackersDeclared', params);
                }
                return true;
            }
        });
    }
}

module.exports = AttackFlow;
