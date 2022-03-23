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
                    inPlay: ['shadow-spirit', 'hammer-knight', 'mist-spirit'],
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: ['shadow-spirit', 'shadow-spirit']
                }
            });
        });

        it('ability triggers on PB ability damage', function () {
            expect(this.player2.inPlay.length).toBe(3);

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(4); // initial 3 -1 destroyed, + 2 from DD
        });

        it("ability doesn't trigger on counter", function () {
            this.player1.endTurn();
            this.player2.clickAttack(this.ironWorker);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickOpponentDie(0);

            this.player1.clickDone(); // No guard
            this.player1.clickYes(); // Counter

            expect(this.player2).toHaveDefaultPrompt();
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player2.inPlay.length).toBe(2);
        });

        it('ability triggers on dice power', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('natural dice power');
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            expect(this.player2).toBeAbleToSelect(this.doubleDown);
        });

        it('ability triggers on molten gold', function () {
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            expect(this.player2).toBeAbleToSelect(this.doubleDown);
        });

        it('ability triggers on crimson bomber', function () {
            this.player1.play(this.crimsonBomber);
            this.player1.clickCard(this.crimsonBomber);
            this.player1.clickPrompt('Detonate 3');
            this.player1.clickCard(this.shadowSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            expect(this.player2).toBeAbleToSelect(this.doubleDown);
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
            expect(this.player2.inPlay.length).toBe(2); // Glow Finch and Butterfly Monk
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.glowFinch);
            //Last Request 2
            this.player2.clickPrompt('Yes');

            expect(this.player2).toHavePrompt('Any Reactions to Glow Finch being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(1); // Butterfly Monk - failing with 2
        });

        it('can only place one unit if that is all that is in conjuration pile', function () {
            expect(this.player2.inPlay.length).toBe(2); // Glow Finch and Butterfly Monk
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.butterflyMonk);
            //Mend 1
            this.player2.clickCard(this.leoSunshadow);

            expect(this.player2).toHavePrompt('Any Reactions to Butterfly Monk being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player2.inPlay.length).toBe(2); // Glow Finch and Butterfly Monk - failing with 3
        });
    });

    describe('triggers respecting summon limits version 2', function () {
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
                    inPlay: ['glow-finch', 'butterfly-monk', 'indiglow-creeper'], // Just having IC in play sometimes fails the tests
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: [
                        'butterfly-monk',
                        'indiglow-creeper',
                        'indiglow-creeper',
                        'luminous-seedling',
                        'luminous-seedling',
                        'luminous-seedling'
                    ]
                }
            });
        });

        // With IC, sometimes fails on Couldn't click on "No" for player2, cannot read property 'uuid' of undefined
        // Once it fails once, this error can get "stuck" and continues the next time this is run, i.e. once IC is removed from the test, sometimes with the error for the next test
        it('cannot place unit that is not in conjuration pile', function () {
            expect(this.player2.inPlay.length).toBe(3); // Glow Finch, Butterfly Monk and Indiglow Creeper
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.glowFinch);
            //Last Request 2
            this.player2.clickPrompt('Yes');

            expect(this.player2).toHavePrompt('Any Reactions to Glow Finch being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.player2.inPlay.length).toBe(2); // Butterfly Monk and Indiglow Creeper - failing with 3
        });

        // With IC, sometimes fails on Couldn't click on "No" for player2, cannot read property 'uuid' of undefined
        it('can only place one unit if that is all that is in conjuration pile', function () {
            expect(this.player2.inPlay.length).toBe(3); // Glow Finch, Butterfly Monk and Indiglow Creeper
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.butterflyMonk);
            //Mend 1
            this.player2.clickCard(this.leoSunshadow);

            expect(this.player2).toHavePrompt('Any Reactions to Butterfly Monk being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.player2.inPlay.length).toBe(3); // Glow Finch, Butterfly Monk and Indiglow Creeper - failing with 4
        });

        it('places 2 creepers into play', function () {
            expect(this.player2.inPlay.length).toBe(3); // Glow Finch, Butterfly Monk and Indiglow Creeper
            const firstCreepers = this.player2.inPlay[2];
            const secondCreepers = this.player2.archives[1];
            const thirdCreepers = this.player2.archives[2];
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(firstCreepers);

            expect(this.player2).toHavePrompt('Any Reactions to Indiglow Creeper being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.luminousSeedling.location).toBe('play area');
            expect(firstCreepers.location).toBe('archives');
            expect(secondCreepers.location).toBe('play area');
            expect(thirdCreepers.location).toBe('play area');
            expect(this.glowFinch.location).toBe('play area');
            expect(this.butterflyMonk.location).toBe('play area');
            expect(this.player2.inPlay.length).toBe(5); // Butterfly Monk, Glow Finch, 2 Creepers, 1 Seedling
        });
    });
});
