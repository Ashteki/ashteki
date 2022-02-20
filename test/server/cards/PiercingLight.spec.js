describe('Piercing Light Ready Spell ', function () {
    describe('In play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm'],
                    hand: ['rayward-recruit'],
                    discard: ['hammer-knight'],
                    spellboard: ['piercing-light']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('Grants overkill to all divine buffed units', function () {
            // buff a unit
            this.player1.clickCard(this.raywardRecruit);
            this.player1.clickPrompt('Play this Ally');
            expect(this.raywardRecruit.location).toBe('play area');
            this.player1.clickDie(0);
            this.player1.clickCard(this.raywardRecruit);
            expect(this.raywardRecruit.attack).toBe(1);

            // check for overkill
            expect(this.raywardRecruit.hasKeyword('overkill')).toBe(true);
            expect(this.raywardRecruit.getKeywordValue('overkill')).toBe(1);
        });
    });
});
