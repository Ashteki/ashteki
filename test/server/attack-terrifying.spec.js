describe('Terrifying attacks', function () {
    describe('vs units with static attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['frostback-bear', 'frost-fang']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'gilder', 'biter'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('defender blocker choice is limited by Terrifying 1', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.frostbackBear); // single attacker
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            expect(this.player2).not.toBeAbleToSelect(this.anchornaut);
        });

        it('vs multiple attackers blocker choice is limited by Terrifying 1', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.frostFang);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            expect(this.player2).toBeAbleToSelect(this.anchornaut);

            this.player2.clickCard(this.anchornaut);
            expect(this.player2).toBeAbleToSelect(this.frostFang);
            expect(this.player2).not.toBeAbleToSelect(this.frostbackBear);
        });

        it('defender guard choice is limited by Terrifying 1', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut); // target
            this.player1.clickCard(this.frostbackBear); // single attacker

            expect(this.player2).toHavePrompt('Choose a guard?');
            expect(this.player2).toBeAbleToSelect(this.biter);
            expect(this.player2).not.toBeAbleToSelect(this.gilder);
        });
    });

    describe('vs dynamic attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'mist-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['silver-snake', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });

            this.silverSnake.tokens.status = 1;
            this.game.checkGameState(true);
            expect(this.silverSnake.attack).toBe(1);
        });

        it('defender blocker choice is limited by Terrifying 1', function () {
            expect(this.silverSnake.status).toBe(1);
            expect(this.silverSnake.attack).toBe(1);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.frostbackBear); // single attacker
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            expect(this.player2).not.toBeAbleToSelect(this.silverSnake);
        });
    });
});
