describe('Summon Spark Drone', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-spark-drone'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a spark drone', function () {
            this.player1.clickCard(this.summonSparkDrone);
            this.player1.clickPrompt('Summon Spark Drone');
            expect(this.sparkDrone.location).toBe('play area');
            expect(this.sparkDrone.isCharged).toBe(false);
        });
    });

    describe('Summon when charged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-spark-drone'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
            this.player1.attachDie(1, this.summonSparkDrone);
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
        });

        it('should place two dice on side of choice', function () {
            this.player1.clickCard(this.summonSparkDrone);
            this.player1.clickPrompt('Summon Spark Drone');
            expect(this.sparkDrone.location).toBe('play area');

            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.player1.dicepool[1].level).toBe('power');
            expect(this.player1.dicepool[2].level).toBe('power');
        });
    });
});
