const Dice = require('../../../../server/game/dice');

describe('Vine Whip Aspect', function () {
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
                    threatZone: ['vine-whip', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed']
                }
            });
        });

        it('attach bleed to leftmost', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.vineWhip.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.falseDemon.upgrades.length).toBe(1);
            expect(this.bleed.parent).toBe(this.falseDemon);
            expect(this.vineWhip.facedown).toBe(false);
        });
    });
});
