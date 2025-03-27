describe('Reinforce Ready Spell', function () {
    describe('Standard tests', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    spellboard: ['reinforce'],
                    archives: ['the-awakened-state'],
                    deck: [
                        'anchornaut',
                        'recollect',
                        'piercing-light',
                        'hammer-knight',
                        'rayward-knight'
                    ],
                    discard: ['concentration', 'concentration']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('take an ally to hand, but not allow action spell', function () {
            this.player1.clickCard(this.reinforce);
            this.player1.clickPrompt('Reinforce');
            expect(this.reinforce.location).toBe('spellboard');
            this.player1.clickPrompt('piercing light');
            expect(this.piercingLight.location).toBe('deck');

            this.player1.clickPrompt('anchornaut');
            expect(this.anchornaut.location).toBe('hand');
            this.player1.clickYes();
            this.player1.clickDie(3);
            this.player1.clickCard(this.ironWorker);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('returns rayward knight that can then be played, and use charge side action', function () {
            this.player1.clickCard(this.reinforce);
            this.player1.clickPrompt('Reinforce');
            this.player1.clickPrompt('rayward knight');
            expect(this.raywardKnight.location).toBe('hand');
            this.player1.clickYes();
            this.player1.clickDie(3);
            this.player1.clickDie(4);
            this.player1.clickDie(5);
            this.player1.clickDone();
            expect(this.raywardKnight.location).toBe('play area');
            expect(this.player1.player.actions.side).toBe(1);
            this.player1.clickCard(this.raywardKnight);
            this.player1.clickPrompt('Charge');

            this.player1.clickCard(this.ironWorker); // attack Iron Worker

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.ironWorker.location).toBe('discard');
            expect(this.player1.actions.side).toBe(0);
        });
    });


    describe('BUG: less than five in deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    spellboard: ['reinforce'],
                    archives: ['the-awakened-state'],
                    deck: [
                        'glory-aspirant',
                        'hammer-knight',
                        'rayward-knight'
                    ],
                    discard: ['concentration', 'concentration']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('take an ally to hand, but not allow action spell', function () {
            this.player1.clickCard(this.reinforce);
            this.player1.clickPrompt('Reinforce');
            this.player1.clickPrompt('Glory Aspirant');
            expect(this.gloryAspirant.location).toBe('hand');
            this.player1.clickYes();
            this.player1.clickDie(0);
            this.player1.clickDie(1); // aspirant ability
            this.player1.clickDone(0);
            expect(this.gloryAspirant.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
