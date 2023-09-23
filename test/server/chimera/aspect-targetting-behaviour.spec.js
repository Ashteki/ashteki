describe('When Attacking', function () {
    describe('with multiple units available', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage', 'hunting-instincts'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('the leftmost unit is selected to attack', function () {
            this.player1.endTurn();

            expect(this.game.attackState.battles.length).toBe(1);
            expect(this.rampage.isAttacker).toBe(true);
        });

        it('exhausted units are skipped', function () {
            this.rampage.tokens.exhaustion = 1;
            expect(this.rampage.exhausted).toBe(true);
            this.player1.endTurn();

            expect(this.game.attackState.battles.length).toBe(1);
            expect(this.huntingInstincts.isAttacker).toBe(true);
        });

        it('hunting instincts targets left to right', function () {
            this.rampage.tokens.exhaustion = 1;
            expect(this.rampage.exhausted).toBe(true);
            this.player1.endTurn();

            expect(this.game.attackState.battles.length).toBe(1);
            const battle = this.game.attackState.battles[0];
            expect(this.huntingInstincts.isAttacker).toBe(true);
            expect(battle.target).toBe(this.anchornaut);
        });

        it('rampage targets right to left', function () {
            this.player1.endTurn();

            expect(this.game.attackState.battles.length).toBe(1);
            const battle = this.game.attackState.battles[0];
            expect(this.rampage.isAttacker).toBe(true);
            expect(battle.target).toBe(this.hammerKnight);
        });
    });
});