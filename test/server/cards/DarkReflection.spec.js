describe('DarkReflection', function () {
    describe('PvP', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'illusion']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['dark-reflection'],
                    spellboard: [],
                    dicepool: ['natural', 'charm'],
                    hand: ['gates-defender', 'summon-sleeping-widows'],
                    archives: ['sleeping-widow']
                }
            });
        });

        it('war within exhausts die', function () {
            expect(this.player2.dicepool[0].exhausted).toBe(false);
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.darkReflection);

            this.player2.clickDie(0);
            expect(this.player2.dicepool[0].exhausted).toBe(true);
            expect(this.darkReflection.location).toBe('discard');
        });

        it('war within wounds if no active dice', function () {
            this.player2.dicepool[0].exhausted = true;
            this.player2.dicepool[1].exhausted = true;
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.darkReflection);

            expect(this.darkReflection.location).toBe('discard');
            expect(this.coalRoarkwin.damage).toBe(2);
        });
    });
});
