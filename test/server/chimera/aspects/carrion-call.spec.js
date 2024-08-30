const Dice = require('../../../../server/game/dice');

describe('Carrion Call', function () {
    describe('Status Ability In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['carrion-call'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker', 'rainwalker', 'rainwalker', 'rainwalker']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player2.dicepool.forEach(d => d.level = 'basic');
        });

        it('the last status places a rainwalker', function () {
            this.carrionCall.tokens.status = 1;
            expect(this.carrionCall.location).toBe('play area');
            this.player1.endTurn();
            // this.player1.clickOk();
            expect(this.carrionCall.location).toBe('play area');
            expect(this.rainwalker.location).toBe('play area');
            expect(this.player2.player.unitsInPlay.length).toBe(4);
        });
    });
});
