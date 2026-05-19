describe('Scatha Kalani status Ability', function () {
    describe('With units', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
            this.scathaKalani.tokens.status = 1;
        });

        it('deals 1 damage to the leftmost unit', function () {
            this.player1.endTurn();
            // start of turn ability trigger
            expect(this.blueJaguar.damage).toBe(1);
        });
    });
    describe('No units', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
            this.scathaKalani.tokens.status = 1;
        });

        it('deals 1 damage to opponent pb', function () {
            this.player1.endTurn();
            // start of turn ability trigger
            expect(this.aradelSummergaard.damage).toBe(1);
        });
    });
});
