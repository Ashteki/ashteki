const Dice = require('../../../../server/game/dice');

describe('Weave Aspect', function () {
    describe('Status Ability', function () {
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
                    inPlay: ['weave'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed', 'webbed']
                }
            });

            this.weave.tokens.status = 2;
        });

        it('attach webbed to leftmost', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.falseDemon.upgrades.length).toBe(1);
            expect(this.falseDemon.anyEffect('webbed')).toBe(true);
            expect(this.anchornaut.anyEffect('webbed')).toBe(false);
            expect(this.anchornaut.location).toBe('play area');
        });

        it('attach webbed to leftmost non-webbed', function () {
            this.player2.attachUpgrade(this.webbed, this.falseDemon);
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.falseDemon.upgrades.length).toBe(1);
            expect(this.falseDemon.anyEffect('webbed')).toBe(true);
            expect(this.anchornaut.anyEffect('webbed')).toBe(true);
            expect(this.anchornaut.location).toBe('play area');
        });
    });
});
