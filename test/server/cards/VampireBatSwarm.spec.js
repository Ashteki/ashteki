describe('Vampire Bat Swarm', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['vampire-bat-swarm', 'living-doll'],
                dicepool: ['natural', 'ceremonial']
            }
        });
        this.livingDoll.tokens.exhaustion = 1;
    });

    it('triggers when destroyed. choose to swarm', function () {
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.vampireBatSwarm);
        // on destroy choices...
        expect(this.player2).toHavePrompt('Activate Swarm?: select dice');
        this.player2.clickDie(1);
        expect(this.vampireBatSwarm.location).toBe('play area');
        expect(this.vampireBatSwarm.damage).toBe(0);
    });

    it('triggers when destroyed. choose not to swarm', function () {
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.vampireBatSwarm);
        // on destroy choices...
        expect(this.player2).toHavePrompt('Activate Swarm?: select dice');
        this.player2.clickPrompt('Cancel');
        expect(this.vampireBatSwarm.location).toBe('archives');
    });
});
