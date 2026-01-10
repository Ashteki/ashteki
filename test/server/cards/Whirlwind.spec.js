describe('Whirlwind', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge', 'whirlwind'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut'],
                    hand: ['purge'],
                    deck: ['sleeping-bear', 'hammer-knight', 'flute-mage']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    dicepool: ['artifice', 'ceremonial', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('lower 2 opponents dice and draw 1 card if pb airborne', function () {
            this.player1.attachDie(0, this.arrenFrostpeak);
            expect(this.arrenFrostpeak.isAirborne).toBe(true);
            this.player1.useCardAbility(this.whirlwind, 'Whirlwind');
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();

            expect(this.player2.dicepool[0].level).toBe('class');
            expect(this.player2.dicepool[1].level).toBe('class');
            expect(this.player1.hand.length).toBe(2);
        });

        it('lower 2 opponents dice and no draw if pb not airborne', function () {
            expect(this.arrenFrostpeak.isAirborne).toBe(false);
            this.player1.useCardAbility(this.whirlwind, 'Whirlwind');
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();

            expect(this.player2.dicepool[0].level).toBe('class');
            expect(this.player2.dicepool[1].level).toBe('class');
            expect(this.player1.hand.length).toBe(1);
        });
    });
});
