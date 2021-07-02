describe('psychic vampire', function () {
    describe('psychic vampire ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['rose-fire-dancer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial', 'ceremonial'],
                    archives: [],
                    hand: ['molten-gold', 'iron-worker', 'crimson-bomber']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['psychic-vampire', 'hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('ability places exhaustion token', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.psychicVampire);

            this.player1.clickCard(this.ironWorker);

            expect(this.psychicVampire.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
        });

        it('ability triggers on counter', function () {
            this.player1.endTurn();
            this.player2.clickAttack(this.roseFireDancer);
            this.player2.clickCard(this.psychicVampire);

            this.player1.clickDone();
            this.player1.clickYes();

            this.player1.clickCard(this.ironWorker);

            expect(this.psychicVampire.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
        });

        it('ability triggers on dice power', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('natural dice power');
            this.player1.clickCard(this.psychicVampire);

            this.player1.clickCard(this.ironWorker);

            expect(this.psychicVampire.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
        });

        it('ability triggers on molten gold', function () {
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.psychicVampire);

            this.player1.clickCard(this.ironWorker);

            expect(this.psychicVampire.location).toBe('discard');
            expect(this.ironWorker.location).toBe('discard');
        });

        it('ability triggers on crimson bomber', function () {
            this.player1.play(this.crimsonBomber);
            this.player1.clickCard(this.crimsonBomber);
            this.player1.clickPrompt('Detonate 3');
            this.player1.clickCard(this.psychicVampire);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.ironWorker); // discard

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.psychicVampire.location).toBe('discard');
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(1);
        });
    });
});
