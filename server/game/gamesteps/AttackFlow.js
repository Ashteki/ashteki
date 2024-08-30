const { BattlefieldTypes, PhoenixbornTypes } = require('../../constants');
const { Costs } = require('../costs');
const AttackState = require('./AttackState');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const BattleStep = require('./BattleStep');
const ChooseDefendersPrompt = require('./ChooseDefendersPrompt');
const SimpleStep = require('./simplestep');

class AttackFlow extends BaseStepWithPipeline {
    constructor(game, target = null, attackers = null, ignoreMainCost = false) {
        super(game);
        this.target = target;
        this.isPBAttack = PhoenixbornTypes.includes(target.type);
        this.attackingPlayer = this.game.activePlayer;
        this.defendingPlayer = target.controller;
        this.ignoreMainCost = ignoreMainCost;
        game.setAttackState(new AttackState(this.target, this.attackingPlayer));

        let steps = [];
        if (attackers) {
            // apply attackers and skip the declare attackers step
            let attackerArray = attackers;
            if (!Array.isArray(attackers)) {
                attackerArray = [attackers];
            }
            this.assignAttackers(attackerArray);
        } else {
            steps.push(new SimpleStep(this.game, () => this.declareAttackers()));
        }

        steps = steps.concat([
            new SimpleStep(this.game, () => this.game.attackState.pruneBattles()),
            this.getDefendersStep(),
            new SimpleStep(this.game, () => {
                if (!this.cancelled) {
                    this.game.raiseEvent('onDefendersDeclared', { attack: this.attack });
                    this.game.saveReplayState('defenders-declared');
                }
            }),
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
            // battle target is null if the card id destroyed mid battle, see vampire bat swarm
            if (battle.target) battle.target.isDefender = false;
            if (battle.guard) battle.guard.isDefender = false;
        });
        this.game.clearAttackState();
    }

    declareAttackers() {
        this.game.checkGameState(true);
        this.game.promptForSelect(this.attackingPlayer, {
            activePromptTitle: this.isPBAttack ? 'Select attackers' : 'Select an attacker',
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            promptTitle: 'Attack',
            source: this.target,
            controller: 'self',
            cardType: BattlefieldTypes,
            cardCondition: (card) => card.canAttack(),
            mode: this.isPBAttack ? 'unlimited' : 'single',
            showCancel: true,
            onSelect: (player, card) => {
                let cards;
                if (Array.isArray(card)) {
                    cards = card;
                } else {
                    cards = [card];
                }

                if (cards.length > 0) {
                    this.assignAttackers(cards);
                }
                return true;
            },
            onCancel: () => {
                this.cancelled = true;
                return true;
            }
        });
    }

    assignAttackers(cards) {
        if (!this.ignoreMainCost) {
            const costEvent = Costs.mainAction().payEvent(
                this.game.getFrameworkContext(this.attackingPlayer)
            );
            this.game.openEventWindow(costEvent);
        }

        this.game.doAttackersDeclared(this.attackingPlayer, cards);
    }

    getDefendersStep() {
        if (this.game.solo && !this.attackingPlayer.isDummy) {
            return new SimpleStep(this.game, () => this.attackingPlayer.opponent.defenderStrategy.execute(this.attack))
        }
        return new ChooseDefendersPrompt(this.game, this.attack);
    }
}

module.exports = AttackFlow;
