describe('Dimona Odinstar', function () {
    describe('Mount Empyrean Mount', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: [],
                    archives: ['empyrean-mount']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
            this.hammerKnight.tokens.exhaustion = 1;
        });

        it('mounts when exhausted', function () {
            this.player1.clickCard(this.dimonaOdinstar);
            this.player1.clickPrompt('Promote');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.hammerKnight);
            expect(this.empyreanMount.location).toBe('play area');
            expect(this.hammerKnight.location).not.toBe('play area');
            expect(this.player1.archives.length).toBe(0);
        });
    });
});