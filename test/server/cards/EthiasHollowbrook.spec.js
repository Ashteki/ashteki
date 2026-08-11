describe('Ethias Hollowbrook Erase ability', function () {
    describe('With ready spells in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'ethias-hollowbrook',
                    inPlay: [
                        'mist-spirit',
                        'iron-worker',
                        'fallen',
                        'squall-stallion',
                        'stormwind-sniper',
                        'shadow-hound'
                    ],
                    spellboard: ['abundance', 'summon-gilder'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['gilder'],
                    hand: ['freezing-blast'],
                    discard: ['holy-relics']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['anchornaut'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('remove a ready spell from the game then deal 2 damage to a unit and 1 damage to their pb ', function () {
            this.player1.useCardAbility(this.ethiasHollowbrook, 'Erase');
            this.player1.clickDie(0);
            this.player1.clickCard(this.abundance);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);
            expect(this.abundance.location).toBe('purged');
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Without ready spells in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'ethias-hollowbrook',
                    inPlay: [
                        'mist-spirit',
                        'iron-worker',
                        'fallen',
                        'squall-stallion',
                        'stormwind-sniper',
                        'shadow-hound'
                    ],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['gilder'],
                    hand: ['freezing-blast'],
                    discard: ['holy-relics']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['anchornaut'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('cannot select ready spell so ability fizzles', function () {
            this.player1.useCardAbility(this.ethiasHollowbrook, 'Erase');
            this.player1.clickDie(0);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
