describe('Botanist', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeve-luminvale',
                    inPlay: ['botanist', 'snapseed', 'stormchaser'],
                    dicepool: ['natural', 'natural', 'artifice', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['nurtured'],
                    hand: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('attach nurtured alteration to unit', function () {
            this.player1.useAbility(this.botanist);
            expect(this.player1).toBeAbleToSelect(this.snapseed);
            expect(this.player1).not.toBeAbleToSelect(this.stormchaser);
            this.player1.clickCard(this.snapseed);
            expect(this.snapseed.upgrades.length).toBe(1);
            expect(this.snapseed.life).toBe(2);
            expect(this.nurtured.location).toBe('play area');
            expect(this.nurtured.parent).toBe(this.snapseed);
        });
    });
});
