describe('Radiant Light', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['charm', 'divine'],
                    hand: ['radiant-light'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('Enters play allows divine die resolution', function () {
            this.player1.play(this.radiantLight);
            expect(this.radiantLight.location).toBe('spellboard');
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[0]);

            this.player1.clickDie(1);
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.dieUpgrades.length).toBe(1);
            expect(this.mistSpirit.attack).toBe(2);
        });
    });

    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['divine', 'charm', 'charm'],
                    spellboard: ['radiant-light'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'noah-redmoon',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('increases life and recover of divine buff units by 1', function () {
            expect(this.mistSpirit.life).toBe(1);
            expect(this.mistSpirit.recover).toBe(0);

            this.player1.useDie(0);
            this.player1.clickCard(this.mistSpirit);

            expect(this.mistSpirit.life).toBe(2);
            expect(this.mistSpirit.recover).toBe(1);
            expect(this.anchornaut.life).toBe(1);
            expect(this.anchornaut.recover).toBe(1);
        });

        it('no buff if exhausted', function () {
            expect(this.mistSpirit.life).toBe(1);
            expect(this.mistSpirit.recover).toBe(0);

            this.player1.useDie(0);
            this.player1.clickCard(this.mistSpirit);

            expect(this.mistSpirit.life).toBe(2);
            expect(this.mistSpirit.recover).toBe(1);
            this.player1.endTurn();
            this.player2.useAbility(this.noahRedmoon);
            this.player2.clickDie(0);
            this.player2.clickCard(this.radiantLight);

            expect(this.radiantLight.exhausted).toBe(true);
            expect(this.mistSpirit.life).toBe(1);
            expect(this.mistSpirit.recover).toBe(0);
        });

        it('flicker returns to deck', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.radiantLight.location).toBe('deck');
        });
    });
});
