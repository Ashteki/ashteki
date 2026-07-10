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

        this.doAttackersDeclared(this.attackingPlayer, cards);
    }

    doAttackersDeclared(attackingPlayer, attackers) {
        const params = {
            attackingPlayer: attackingPlayer,
            attackers: attackers,
            target: this.game.attackState.target
        };
        this.game.addAlert(
            'danger',
            '{0} attacks {1} with {2} units: {3}',
            this.game.attackState.attackingPlayer,
            this.game.attackState.target,
            attackers.length,
            attackers
        );

        if (!this.attackingPlayer.opponent.optionSettings.noAttackAlerts) {
            this.game.queueUserAlert(this.game.getFrameworkContext(this.attackingPlayer), {
                timed: true,
                style: 'danger',
                promptTitle: (this.game.attackState.isPBAttack ? 'PB ' : 'UNIT ') + 'ATTACK!',
                menuTitle: this.game.attackState.target.name + ' is being attacked',
                controls: [
                    {
                        type: 'targeting',
                        source: this.game.attackState.target.getShortSummary()
                        // ,
                        // targets: [attackState.target.getShortSummary()]
                    }
                ]
            });
        }

        this.game.raiseEvent('onAttackersDeclared', params, (event) => {
            // check for horde attack - this has to be here to support charging horde rainwalker summon as interrupt
            if (attackers.some((unit) => unit.anyEffect('hordeAttack'))) {
                const hordeAttackers = event.attackingPlayer.getHordeAttackers(event.attackers);
                if (hordeAttackers.length > 0) {
                    event.attackers.push(...hordeAttackers);
                }
            }

            this.game.gameLog.push({
                id: 'cl' + this.game.getCardLogIndex(),
                act: 'attack',
                obj: this.game.attackState.target,
                player: attackingPlayer
            });

            let key = 1;
            for (let c of event.attackingPlayer.unitsInPlay) {
                if (attackers.includes(c)) {
                    if (this.game.attackState.target.location !== 'play area') {
                        c.exhaust();
                    } else {
                        const newBattle = {
                            key: key,
                            attacker: c,
                            attackerClone: c.createSnapshot(),
                            target: this.game.attackState.target,
                            guard: null,
                            counter: false,
                            resolved: false
                        };
                        const forcedBlocker = event.attackingPlayer.opponent.unitsInPlay.find(
                            (unit) => {
                                const blockEffects = unit.getEffects(
                                    'forceBlock',
                                    (effect) => effect.value.value === c
                                );
                                if (blockEffects.length > 0) {
                                    return true;
                                }
                            }
                        );
                        if (forcedBlocker) {
                            newBattle.guard = forcedBlocker;
                        }
                        this.game.attackState.battles.push(newBattle);
                        c.isAttacker = true;
                        c.wasAttacker = true;
                        key++;
                    }
                }
            }

            this.game.saveReplayState('attackers-declared');
        });
    }

    getDefendersStep() {
        if (this.game.solo && !this.attackingPlayer.isDummy) {
            return new SimpleStep(this.game, () =>
                this.attackingPlayer.opponent.defenderStrategy.execute(this.attack)
            );
        }
        return new ChooseDefendersPrompt(this.game, this.attack);
    }
}

module.exports = AttackFlow;
