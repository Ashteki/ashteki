const Dice = require('../../../../server/game/dice');

describe('Torrential Sacrifice Aspect', function () {
    describe('Reveal with no destroy target', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    archives: ['rainwalker'],
                    threatZone: ['torrential-sacrifice', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('puts rainwalker into play', function () {
            expect(this.torrentialSacrifice.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rainwalker.location).toBe('play area');
            expect(this.torrentialSacrifice.location).toBe('play area');
            expect(this.torrentialSacrifice.facedown).toBe(false);
        });
    });

    describe('Reveal with target to destroy', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['scarlet-seed', 'rainwalker'],
                    deck: [],
                    spellboard: [],
                    archives: [],
                    threatZone: ['torrential-sacrifice', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('destroy conjured aspect to gain 1 red rains token', function () {
            expect(this.torrentialSacrifice.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.scarletSeed.location).toBe('play area');
            expect(this.rainwalker.location).toBe('archives');
            expect(this.torrentialSacrifice.location).toBe('play area');
            expect(this.torrentialSacrifice.facedown).toBe(false);
            expect(this.corpseOfViros.redRains).toBe(1);
        });
    });

});