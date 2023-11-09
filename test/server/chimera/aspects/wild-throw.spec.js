const Dice = require('../../../../server/game/dice');

describe('Wild Throw Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['wild-throw', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor', 'vigor', 'vigor']
                }
            });
        });

        it('stun leftmost and reposition to rightmost', function () {
            expect(this.player1.inPlay[2]).toBe(this.hammerKnight);

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.anchornaut.upgrades.length).toBe(1);
            expect(this.anchornaut.exhausted).toBe(true);
            expect(this.wildThrow.location).toBe('play area');
            expect(this.wildThrow.facedown).toBe(false);
            expect(this.stun.location).toBe('play area');
            expect(this.player1.inPlay[2]).toBe(this.anchornaut);
        });
    });
});
