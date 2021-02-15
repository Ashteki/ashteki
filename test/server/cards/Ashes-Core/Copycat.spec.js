describe('Copycat', function () {
    describe('reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                    deck: ['redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy action spell (MG)', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);

            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(3);
        });

        it('copy pb ablity (water blast)', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);

            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(2);
        });

        it('not triggered by unit ablity (blood archer)', function () {
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickPrompt('Blood Shot');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.damage).toBe(1);
            expect(this.player2).not.toBeAbleToSelect(this.copycat);
        });
    });

    describe('reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                    deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat', 'dispel'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy pb ability (coal)', function () {
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickPrompt('Slash');
            this.player1.clickCard(this.redirect); // discard
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.dispel);
            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });
});
