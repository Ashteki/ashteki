describe('Radiant Leviathan', function () {
    describe('Refract on destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'tristan-darkwater',
                    dicepool: ['sympathy', 'sympathy', 'time', 'charm', 'illusion'],
                    archives: ['prism-tetra', 'prism-tetra', 'prism-tetra'],
                    inPlay: ['radiant-leviathan'],
                    hand: ['summon-radiant-leviathan']
                }
            });

            this.radiantLeviathan.tokens.status = 2;
            this.radiantLeviathan.tokens.damage = 4; // almost dead
        });

        it('destroy leviathan and place prism ', function () {
            expect(this.radiantLeviathan.location).toBe('play area');
            expect(this.radiantLeviathan.status).toBe(2);
            this.player1.clickAttack(this.radiantLeviathan);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickNo();

            expect(this.player2.inPlay.length).toBe(2);
            expect(this.prismTetra.location).toBe('play area');
            expect(this.prismTetra.anyEffect('cannotBeAttackTarget')).toBe(false);
            expect(this.radiantLeviathan.location).toBe('archives');
        });
    });
});
