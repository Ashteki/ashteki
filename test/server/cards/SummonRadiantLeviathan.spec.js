describe('Summon Radiant Leviathan', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tristan-darkwater',
                    dicepool: ['sympathy', 'sympathy', 'time', 'charm', 'illusion'],
                    inPlay: ['prism-tetra', 'prism-tetra', 'prism-tetra'],
                    archives: ['radiant-leviathan'],
                    hand: ['summon-radiant-leviathan']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('place leviathan and status tokens and make other units immune to attack target', function () {
            this.player1.play(this.summonRadiantLeviathan);
            this.player1.clickDie(3);
            this.player1.clickDie(4);
            this.player1.clickDone();

            expect(this.radiantLeviathan.location).toBe('play area');
            expect(this.radiantLeviathan.status).toBe(3);

            expect(this.prismTetra.anyEffect('cannotBeAttackTarget')).toBe(true);
            expect(this.radiantLeviathan.anyEffect('cannotBeAttackTarget')).toBe(false);
        });
    });
});
