const Dice = require('../../../../server/game/dice');

describe('At the gates Aspect', function () {
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['at-the-gates', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('insert rainwalker to the left', function () {
            expect(this.atTheGates.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rainwalker.location).toBe('play area');
            expect(this.player2.player.isLeftmostUnit(this.rainwalker)).toBe(true);
            expect(this.player2.player.isRightmostUnit(this.rainwalker)).toBe(false);
            expect(this.rainwalker.facedown).toBe(false);
            expect(this.atTheGates.facedown).toBe(false);
        });
    });

    describe('On Round End when in play', function () {
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['at-the-gates', 'hunting-instincts'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker']
                }
            });

            this.atTheGates.tokens.exhaustion = true;
            this.huntingInstincts.tokens.exhaustion = true;
        });

        it('insert rainwalker to the left', function () {
            expect(this.game.round).toBe(1);
            this.player1.endTurn();
            // end round
            this.player1.clickDone();
            expect(this.rainwalker.location).toBe('play area');
            expect(this.game.round).toBe(2);
            expect(this.player2.player.isLeftmostUnit(this.rainwalker)).toBe(true);
            expect(this.player2.player.isRightmostUnit(this.rainwalker)).toBe(false);
            expect(this.rainwalker.facedown).toBe(false);
            expect(this.atTheGates.facedown).toBe(false);
        });
    });

    describe('On Round End when NOT in play', function () {
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: ['at-the-gates'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker']
                }
            });
        });

        it('no rainwalker summon', function () {
            expect(this.game.round).toBe(1);
            expect(this.rainwalker.location).toBe('archives');
            this.player1.endTurn();
            // end round
            this.player1.clickDone();
            expect(this.rainwalker.location).toBe('archives');
            expect(this.game.round).toBe(2);
            expect(this.atTheGates.facedown).toBe(true);
        });
    });
});
