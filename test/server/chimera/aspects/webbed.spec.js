const Dice = require('../../../../server/game/dice');

describe('Webbed Aspect', function () {
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

        it('untangle removes webbed status', function () {
            expect(this.player2.dicepool.filter(d => d.level === 'power').length).toBe(0);
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // power dice on untangle reroll
            this.player2.attachUpgrade(this.webbed, this.anchornaut);
            expect(this.webbed.parent).toBe(this.anchornaut);
            expect(this.silksteel.facedown).toBe(true);
            this.player1.useCardAbility(this.webbed, 'Untangle');

            expect(this.webbed.location).toBe('archives');
            expect(this.anchornaut.anyEffect('webbed')).toBe(false);
            expect(this.anchornaut.upgrades.length).toBe(0);
            expect(this.anchornaut.location).toBe('play area');
            expect(this.player2.dicepool.filter(d => d.level === 'power').length).toBe(2);
        });
    });
});
