describe('Double Down', function () {
    describe('triggers', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial', 'ceremonial'],
                    archives: [],
                    hand: ['molten-gold', 'crimson-bomber']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['shadow-spirit', 'hammer-knight'],
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: ['shadow-spirit', 'shadow-spirit']
                }
            });
        });

        it('ability triggers on PB damage', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(3);
        });

        it("ability doesn't trigger on counter", function () {
            this.player1.endTurn();
            this.player2.clickAttack(this.ironWorker);
            this.player2.clickCard(this.shadowSpirit);
            this.player2.clickOpponentDie(0);

            this.player1.clickDone(); // No guard
            this.player1.clickYes(); // Counter

            expect(this.player2).not.toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            expect(this.ironWorker.location).toBe('discard');
            expect(this.shadowSpirit.location).toBe('archives');
        });

        it('ability triggers on dice power', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('natural dice power');
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
        });

        it('ability triggers on molten gold', function () {
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
        });

        it('ability triggers on crimson bomber', function () {
            this.player1.play(this.crimsonBomber);
            this.player1.clickCard(this.crimsonBomber);
            this.player1.clickPrompt('Detonate 3');
            this.player1.clickCard(this.shadowSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
        });
    });
    // The following is failing as onDestroyed already has the conjuration in the archives
    describe('triggers respecting summon limits', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial', 'ceremonial'],
                    archives: [],
                    hand: ['molten-gold', 'crimson-bomber']
                },
                player2: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['glow-finch', 'butterfly-monk'],
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: ['butterfly-monk']
                }
            });
        });

        it('cannot place unit that is not in conjuration pile', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.glowFinch);
            //Last Request 2
            this.player2.clickPrompt('Yes');

            expect(this.player2).toHavePrompt('Any Reactions to Glow Finch being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(2); // PB plus Iron Worker
        });

        it('can only place one unit if that is all that is in conjuration pile', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.butterflyMonk);
            //Mend 1
            this.player2.clickCard(this.leoSunshadow);

            expect(this.player2).toHavePrompt('Any Reactions to Butterfly Monk being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(3); // PB plus Iron Worker plus Butterfly Monk
        });
    });
});
