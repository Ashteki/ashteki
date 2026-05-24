describe('Chimera Survival Mode', function () {
    describe('When the chimera has wounds above life total', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'chimera',
                gameFormat: 'survival',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['fire-archer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
            this.corpseOfViros.tokens.damage = 29;
            expect(this.game.isSurvival).toBe(true);
        });

        it('does not end the game', function () {
            expect(this.corpseOfViros.damage).toBe(29);
            this.player1.play(this.fireArcher);
            this.player1.clickCard(this.corpseOfViros);
            expect(this.corpseOfViros.damage).toBe(30);
            expect(this.game.winner).toBeUndefined();
        });
    });

    describe('When the round ends', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'chimera',
                gameFormat: 'survival',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['fire-archer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('the chimera threat level increases by one', function () {
            expect(this.game.round).toBe(1);
            expect(this.corpseOfViros.threat).toBe(4);

            this.player1.endTurn();
            this.player1.clickDone();
            expect(this.game.round).toBe(2);

            expect(this.corpseOfViros.threat).toBe(5);
            expect(this.game.winner).toBeUndefined();
        });
    });
});
