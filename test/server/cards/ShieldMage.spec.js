describe('Shield Mage', function () {
    describe('PvP', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'shield-mage'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('cannot be targetted for attack', function () {
            this.player1.clickPrompt('Attack');
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.shieldMage);
            expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
        });

        it('can be targetted for attack if exhausted', function () {
            this.shieldMage.tokens.exhaustion = 1;
            this.player1.clickPrompt('Attack');
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.shieldMage);
            expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
        });
    });

    describe('with flock shepherd vs crushing grip with buffer unit', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'shield-mage', 'flock-shepherd', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['crushing-grip'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('units cannot be targetted for attack, so goes for pb', function () {
            this.player1.endTurn();
            // attack

            expect(this.ironWorker.exhausted).toBe(true);
            expect(this.game.attackState.target).toBe(this.aradelSummergaard);
        });
    });

    describe('with flock shepherd vs crushing grip without buffer unit', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shield-mage', 'iron-worker', 'flock-shepherd', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['crushing-grip'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('shield mage is exhausted, so becomes attack target', function () {
            expect(this.shieldMage.exhausted).toBe(true); // crushing grip in play

            this.player1.endTurn();
            // attackers declared
            this.player1.clickPass(); // shepherd buff reaction
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.shieldMage.exhausted).toBe(true);

            expect(this.game.attackState.target).toBe(this.shieldMage);
        });
    });

    describe('BUG REPORT (rediking): pb targetted when shield mage should be target.', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shield-mage', 'iron-worker', 'flock-shepherd', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['crushing-grip'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('shield mage is exhausted, so becomes attack target', function () {
            expect(this.shieldMage.exhausted).toBe(true); // crushing grip in play

            this.player1.endTurn();
            // attackers declared
            this.player1.clickPass(); // shepherd buff reaction
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.shieldMage.exhausted).toBe(true);

            expect(this.game.attackState.target).toBe(this.shieldMage);
        });
    });
});
