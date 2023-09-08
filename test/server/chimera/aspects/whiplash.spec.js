const Dice = require('../../../../server/game/dice');

describe('Whiplash Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['whiplash', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('destroy leftmost wounded enemy unit', function () {
            this.ironWorker.tokens.damage = 1;
            expect(this.whiplash.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.ironWorker.location).toBe('discard');
            expect(this.anchornaut.location).toBe('play area');
            expect(this.fluteMage.damage).toBe(0);
            expect(this.whiplash.facedown).toBe(false);
        });

        it('damage leftmost un-wounded enemy unit if no wounds found', function () {
            expect(this.whiplash.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.ironWorker.location).toBe('play area');
            expect(this.fluteMage.location).toBe('play area');
            expect(this.falseDemon.location).toBe('play area');
            expect(this.falseDemon.damage).toBe(1);
            expect(this.fluteMage.damage).toBe(0);
            expect(this.whiplash.facedown).toBe(false);
        });
    });
});