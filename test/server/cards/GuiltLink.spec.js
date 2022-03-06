describe('Guilt link', function () {
    describe('getting status tokens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'iron-rhino'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['molten-gold', 'one-hundred-blades']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['guilt-link']
                }
            });
        });

        it('gets status token on pb attack', function () {
            expect(this.guiltLink.status).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done'); // no blocker
            expect(this.guiltLink.status).toBe(1);
        });

        it('gets status token on pb guard of attack', function () {
            expect(this.guiltLink.status).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickCard(this.coalRoarkwin);
            expect(this.guiltLink.status).toBe(1);
        });

        it('no status token if exhausted', function () {
            this.guiltLink.tokens.exhaustion = 1;
            expect(this.guiltLink.status).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done'); // no blocker
            expect(this.guiltLink.status).toBe(0);
        });

        it('no status token on overkill', function () {
            expect(this.guiltLink.status).toBe(0);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironRhino);
            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickYes(); // counter
            expect(this.coalRoarkwin.damage).toBe(2);
            expect(this.guiltLink.status).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('no status token on Action Spell', function () {
            expect(this.guiltLink.status).toBe(0);

            this.player1.play(this.moltenGold);

            this.player1.clickCard(this.coalRoarkwin);
            expect(this.coalRoarkwin.damage).toBe(3);
            expect(this.guiltLink.status).toBe(0);
        });

        it('no status token on dealDamage', function () {
            expect(this.guiltLink.status).toBe(0);

            this.player1.play(this.oneHundredBlades);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            this.player1.clickCard(this.coalRoarkwin);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.guiltLink.status).toBe(0);
        });

        it('no status token increase if already has one', function () {
            this.guiltLink.tokens.status = 1;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done'); // no blocker

            expect(this.guiltLink.status).toBe(1);
        });
    });

    describe('taking action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'iron-rhino'],
                    dicepool: ['natural', 'illusion', 'sympathy', 'charm', 'natural', 'natural'],
                    hand: ['molten-gold'],
                    spellboard: ['guilt-link']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut']
                }
            });

            this.guiltLink.tokens.status = 1;
        });

        it('destroys own unit and prompts opponent to destroy unit', function () {
            this.player1.clickCard(this.guiltLink);
            this.player1.clickPrompt('Guilt Link');
            expect(this.player2).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.location).toBe('discard');

            expect(this.player2).not.toBeAbleToSelect(this.ironRhino);
            this.player2.clickCard(this.anchornaut);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
