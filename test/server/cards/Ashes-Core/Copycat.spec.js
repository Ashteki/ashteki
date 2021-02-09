describe('Copycat', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blood-shaman', 'blood-archer'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
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

        this.player2.clickCard(this.bloodShaman);
        expect(this.bloodShaman.location).toBe('discard');
    });

    it('copy pb ablity (water blast)', function () {
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.ironWorker);

        this.player2.clickCard(this.copycat);
        this.player2.clickDie(0);

        this.player2.clickCard(this.bloodShaman);
        expect(this.bloodShaman.location).toBe('discard');
    });

    it('not triggered by unit ablity (blood archer)', function () {
        this.player1.clickCard(this.bloodArcher);
        this.player1.clickPrompt('Blood Shot');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.damage).toBe(1);
        expect(this.player2).not.toBeAbleToSelect(this.copycat);
    });
});
