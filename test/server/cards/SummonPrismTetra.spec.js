describe('Summon Prism Tetra', function () {
    describe('when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    dicepool: ['sympathy', 'sympathy', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-prism-tetra'],
                    archives: ['prism-tetra', 'prism-tetra', 'prism-tetra', 'prism-tetra'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('normal summon places 3 tetras', function () {
            expect(this.player1.actions.main).toBe(true);
            this.player1.clickCard(this.summonPrismTetra);
            this.player1.clickPrompt('Summon Prism Tetra');
            //don't require action type selection
            expect(this.prismTetra.location).toBe('play area');
            expect(this.player1.inPlay.length).toBe(3);
            expect(this.prismTetra.anyEffect('cannotBeSpellTarget')).toBe(false);
        });
    });

    describe('summon when focus 1 makes tetras unable to target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    dicepool: ['sympathy', 'sympathy', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-prism-tetra', 'summon-prism-tetra'],
                    archives: ['prism-tetra', 'prism-tetra', 'prism-tetra', 'prism-tetra'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('places status token for enter play and focus 2', function () {
            expect(this.player1.actions.main).toBe(true);
            this.player1.clickCard(this.summonPrismTetra);
            this.player1.clickPrompt('Summon Prism Tetra');
            this.player1.endTurn();

            expect(this.prismTetra.location).toBe('play area');
            expect(this.player1.inPlay.length).toBe(3);
            expect(this.prismTetra.anyEffect('cannotBeSpellTarget')).toBe(true);
            expect(this.prismTetra.anyEffect('cannotBeAbilityTarget')).toBe(true);
            expect(this.prismTetra.anyEffect('cannotBeDicePowerTarget')).toBe(true);

            this.player2.endTurn();
            expect(this.prismTetra.anyEffect('cannotBeSpellTarget')).toBe(false);
            expect(this.prismTetra.anyEffect('cannotBeAbilityTarget')).toBe(false);
            expect(this.prismTetra.anyEffect('cannotBeDicePowerTarget')).toBe(false);

        });
    });
});
