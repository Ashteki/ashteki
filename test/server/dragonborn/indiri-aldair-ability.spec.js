const Dice = require('../../../server/game/dice');

describe('Indiri Aldair status Ability', function () {
    describe('With units', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'indiri-aldair',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'indiri-ultimate',
                    spellboard: [],
                    inPlay: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon'],
                    threatZone: ['hunting-instincts'],
                    archives: ['whistling-arrow', 'burning-arrow']
                }
            });
            this.indiriAldair.tokens.status = 1;
        });

        it('puts one random arrow into play', function () {
            this.player1.endTurn();
            // start of turn ability trigger
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.archives.length).toBe(1);
        });
    });
});
