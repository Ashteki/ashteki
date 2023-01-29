describe('Phoenix Attendant', function () {
    describe('in play - Alleviate ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['phoenix-attendant'],
                    spellboard: [],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['old-salt']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
                    spellboard: ['summon-butterfly-monk']
                }
            });

            this.brennenBlackcloud.tokens.damage = 2;
        });

        it('move 1 token from pb to attendant', function () {
            expect(this.brennenBlackcloud.damage).toBe(2);
            expect(this.phoenixAttendant.damage).toBe(0);

            this.player1.clickCard(this.phoenixAttendant);
            this.player1.clickPrompt('Alleviate 1');
            expect(this.brennenBlackcloud.damage).toBe(1);
            expect(this.phoenixAttendant.damage).toBe(1);
        });
    });
});
