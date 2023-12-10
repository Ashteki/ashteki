describe('Chimera Charmer', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'charm'],
                    hand: ['chimera-charmer'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('Subdue Ability allows charm die resolution', function () {
            this.player1.clickCard(this.chimeraCharmer);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.chimeraCharmer.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[0]);

            this.player1.clickDie(1);
            this.player1.clickCard(this.frostFang);
            expect(this.frostFang.attack).toBe(2);

            // imbued attack modification
            expect(this.chimeraCharmer.attack).toBe(3);
        });
    });
});
