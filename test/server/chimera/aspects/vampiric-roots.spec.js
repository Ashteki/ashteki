describe('Vampiric Roots Aspect', function () {
    describe('On unit destruction by attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['vampiric-roots'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('attack and destroy heals 2 pb dmg', function () {
            this.corpseOfViros.tokens.damage = 5;
            this.player1.endTurn();
            this.player1.clickDone();
            this.player1.clickNo();
            expect(this.hammerKnight.location).toBe('discard');
            expect(this.corpseOfViros.damage).toBe(3);
        });
    });
});
