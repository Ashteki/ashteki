describe('Summon Calamity Golem', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tristan-darkwater',
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'charm', 'illusion'],
                    inPlay: ['fire-archer'],
                    archives: ['calamity-golem'],
                    hand: ['summon-calamity-golem']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('destroy ally, place golem and add wounds to it', function () {
            this.player1.play(this.summonCalamityGolem);
            this.player1.clickCard(this.fireArcher);

            expect(this.calamityGolem.location).toBe('play area');
            expect(this.calamityGolem.damage).toBe(1);
            expect(this.fireArcher.location).toBe('discard');
        });
    });
});
