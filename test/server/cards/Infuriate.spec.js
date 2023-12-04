describe('Infuriate', function () {
    describe('On Attackers declared', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['iron-rhino'],
                    hand: ['infuriate'],
                    dicepool: ['ceremonial']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight']
                }
            });
        });

        it('host damage on attack and increased attack', function () {
            this.player1.play(this.infuriate);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.upgrades.length).toBe(1);
            expect(this.ironRhino.damage).toBe(0);
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.ironRhino);

            expect(this.ironRhino.damage).toBe(2);
            expect(this.ironRhino.attack).toBe(9);

        });
    });

    describe('vs Cobra, On Attackers declared', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['ruby-cobra'],
                    hand: ['infuriate'],
                    dicepool: ['ceremonial']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight']
                }
            });
        });

        it('host damage on attack and increased attack', function () {
            const deckCount = this.player2.deck.length;
            this.player1.play(this.infuriate);
            this.player1.clickCard(this.rubyCobra);
            expect(this.rubyCobra.upgrades.length).toBe(1);
            expect(this.rubyCobra.damage).toBe(0);
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.rubyCobra);

            // choose reaction order
            this.player1.clickCard(this.rubyCobra);
            expect(this.rubyCobra.location).toBe('archives');
            expect(this.player2.deck.length).toBe(deckCount - 1); // ruby forces discard before infuriate damage
        });
    });
});
