const Dice = require('../../../../server/game/dice');

describe('Silksteel Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['mist-spirit']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['silksteel', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed']
                }
            });
        });

        it('attach webbed to leftmost when none in play', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.silksteel.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.falseDemon.upgrades.length).toBe(1);
            expect(this.webbed.parent).toBe(this.falseDemon);
            expect(this.falseDemon.anyEffect('webbed')).toBe(true);
            expect(this.silksteel.facedown).toBe(false);
            expect(this.anchornaut.location).toBe('play area');
        });
    });

    describe('On Reveal vs webbed unit', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['mist-spirit']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['silksteel', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed', 'webbed']
                }
            });
        });

        it('destroy leftmost webbed unit when none in play', function () {
            this.player2.attachUpgrade(this.webbed, this.anchornaut);
            expect(this.webbed.parent).toBe(this.anchornaut);
            expect(this.anchornaut.location).toBe('play area');
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.silksteel.facedown).toBe(true);
            this.player1.endTurn();
            expect(this.anchornaut.location).toBe('play area');

            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.falseDemon.upgrades.length).toBe(0);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.webbed.location).toBe('archives');
            expect(this.silksteel.facedown).toBe(false);
        });
    });
});
