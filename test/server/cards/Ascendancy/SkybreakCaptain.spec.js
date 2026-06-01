describe('Skybreak Captain', function () {
    describe('Commander', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    inPlay: ['anchornaut', 'skybreak-captain']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('add 1 to another units attack', function () {
            this.player1.attachDie(0, this.skybreakCaptain);
            this.player1.clickCard(this.skybreakCaptain);
            this.player1.clickPrompt('Aerial Command 1');
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.attack).toBe(1);
        });
    });

    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    hand: ['skybreak-captain'],
                    inPlay: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('places an astral die on self', function () {
            this.player1.play(this.skybreakCaptain);
            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.skybreakCaptain.location).toBe('play area');
            expect(this.skybreakCaptain.dieUpgrades.length).toBe(1);
        });
    });
});
