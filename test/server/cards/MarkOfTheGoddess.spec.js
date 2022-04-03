describe('Mark of the Goddess played', function () {
    describe('plenty choices', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['mark-of-the-goddess']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: ['summon-iron-rhino', 'summon-iron-rhino']
                }
            });
        });

        it('deals attack damage from one unit to another', function () {
            this.player1.clickCard(this.markOfTheGoddess); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker); // choose iw for 2 damage
            this.player1.clickCard(this.anchornaut); // choose to take 2

            expect(this.anchornaut.location).toBe('discard');
        });

        it('may not deal attack damage to opposing PB if other unexhausted units exist', function () {
            this.player1.clickCard(this.markOfTheGoddess); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker); // choose iw for 2 damage
            expect(this.player1).not.toBeAbleToSelect(this.coalRoarkwin);
        });
    });

    describe('No other unexhausted choice', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['mark-of-the-goddess']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    spellboard: ['summon-iron-rhino', 'summon-iron-rhino', 'chant-of-revenge']
                }
            });
            this.anchornaut.tokens.exhaustion = 1;
        });

        it('allows player to target phoenixborn', function () {
            this.player1.clickCard(this.markOfTheGoddess); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker); // choose iw for 2 damage

            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);
            expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
            this.player1.clickCard(this.coalRoarkwin);
            expect(this.coalRoarkwin.damage).toBe(2);
        });

        it('player can target exhausted unit', function () {
            this.player1.clickCard(this.markOfTheGoddess); // play card
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickCard(this.ironWorker); // choose iw for 2 damage

            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).toBeAbleToSelect(this.anchornaut);
            expect(this.player1).toBeAbleToSelect(this.coalRoarkwin);
            this.player1.clickCard(this.anchornaut);
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.anchornaut.location).toBe('discard');
        });
    });
});
