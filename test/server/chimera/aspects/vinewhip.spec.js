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

    describe('Bleed vs nightshade swallow', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightshade-swallow', 'false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
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
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['vine-whip', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed']
                }
            });
        });

        it('attach bleed to leftmost', function () {
            this.nightshadeSwallow.tokens.damage = 1; // setting up destroy from bleed
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.vineWhip.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.nightshadeSwallow.upgrades.length).toBe(1);
            expect(this.bleed.parent).toBe(this.nightshadeSwallow);
            expect(this.vineWhip.facedown).toBe(false);

            expect(this.player1).toHaveDefaultPrompt();
            this.player1.actions.main = false; // fudge turn action
            this.player1.endTurn();

            // triggers bleed
            expect(this.player1).toHavePrompt('Pacify 1');
            this.player1.clickCard(this.rampage);
            expect(this.rampage.exhausted).toBe(true);
            expect(this.nightshadeSwallow.location).toBe('archives');

            // informs real player of behaviour roll next turn
            this.player1.clickPrompt('Ok');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
