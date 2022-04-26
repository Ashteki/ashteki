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
                    hand: ['molten-gold', 'crimson-bomber', 'natures-wrath']
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
            expect(this.player1).toHaveDefaultPrompt();

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

        it('ability triggers on AoE - natures wrath', function () {
            expect(this.player2.inPlay.length).toBe(3);
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.shadowSpirit);

            expect(this.player2).toHavePrompt('Any Reactions to Shadow Spirit being destroyed?');
            expect(this.player2).toBeAbleToSelect(this.doubleDown);
            this.player2.clickCard(this.doubleDown);
            // killed 1 SS, summoned 2...
            expect(this.player2.inPlay.length).toBe(4);

            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.player2.inPlay[2]); // new shadowSpirit
            expect(this.player2.inPlay[2].damage).toBe(0);
            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

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
                    inPlay: ['glow-finch', 'butterfly-monk', 'indiglow-creeper'],
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
            const firstCreeper = this.player2.inPlay[2];
            const secondCreeper = this.player2.archives[1];
            const thirdCreeper = this.player2.archives[2];
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(firstCreeper);

            expect(this.player2).toHavePrompt('Any Reactions to Indiglow Creeper being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.luminousSeedling.location).toBe('play area');
            expect(firstCreeper.location).toBe('archives');
            expect(secondCreeper.location).toBe('play area');
            expect(thirdCreeper.location).toBe('play area');
            expect(this.glowFinch.location).toBe('play area');
            expect(this.butterflyMonk.location).toBe('play area');
            expect(this.player2.inPlay.length).toBe(5); // Butterfly Monk, Glow Finch, 2 Creepers, 1 Seedling
        });
    });

    describe('triggers respecting summon limits with 2 Creepers in play', function () {
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
                    inPlay: [
                        'glow-finch',
                        'butterfly-monk',
                        'indiglow-creeper',
                        'indiglow-creeper'
                    ],
                    spellboard: ['summon-shadow-spirit'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: [
                        'butterfly-monk',
                        'indiglow-creeper',
                        'luminous-seedling',
                        'luminous-seedling',
                        'luminous-seedling'
                    ]
                }
            });
        });
        it('places 1 creeper into player1', function () {
            expect(this.player2.inPlay.length).toBe(4); // Glow Finch, Butterfly Monk and 2 Indiglow Creeper
            const firstCreeper = this.player2.inPlay[2];
            const secondCreeper = this.player2.inPlay[3];
            const thirdCreeper = this.player2.archives[1];
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(firstCreeper);

            expect(this.player2).toHavePrompt('Any Reactions to Indiglow Creeper being destroyed?');
            this.player2.clickCard(this.doubleDown);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.luminousSeedling.location).toBe('play area');
            expect(firstCreeper.location).toBe('archives');
            expect(secondCreeper.location).toBe('play area');
            expect(thirdCreeper.location).toBe('play area');
            expect(this.glowFinch.location).toBe('play area');
            expect(this.butterflyMonk.location).toBe('play area');
            expect(this.player2.inPlay.length).toBe(5); // Butterfly Monk, Glow Finch, 2 Creepers, 1 Seedling
        });
    });
});
