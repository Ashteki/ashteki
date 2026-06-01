describe('Puncturing Wind', function () {
    describe('with one target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'puncturing-wind', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 2 damage to highest life unit', function () {
            this.player1.play(this.puncturingWind);
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.player2.dicepool[1].level).toBe('class');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickDone();

            expect(this.player2).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).toBeAbleToSelect(this.blueJaguar);
            expect(this.player2).toBeAbleToSelect(this.beastTamer);

            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.blueJaguar);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickDone();

            expect(this.aradelSummergaard.damage).toBe(0);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
