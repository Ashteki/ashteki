describe('Clashing Tempers', function () {
    describe('from hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker', 'ash-spirit'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['clashing-tempers', 'freezing-blast'],
                    archives: ['ice-adaptation', 'fire-adaptation']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['rins-fury', 'golden-veil'],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('select and attach fire and ice adaptations to two units', function () {
            this.player1.play(this.clashingTempers);
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.ironWorker);
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.ironWorker.upgrades.length).toBe(1);
        });
    });

    describe('from hand without available adaptations', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker', 'ash-spirit'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['clashing-tempers', 'freezing-blast'],
                    archives: ['ice-adaptation']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['rins-fury', 'golden-veil'],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('does as much as it can', function () {
            this.player1.play(this.clashingTempers);
            this.player1.clickDie(0);
            this.player1.clickDone();
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.ironWorker);
            expect(this.mistSpirit.upgrades.length).toBe(0);
            expect(this.ironWorker.upgrades.length).toBe(1);
        });
    });
});
