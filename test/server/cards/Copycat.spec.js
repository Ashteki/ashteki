describe('Copycat', function () {
    describe('reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover', 'anguish'],
                    deck: ['redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy action spell (MG)', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);

            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(3);
        });

        it('skip action spell (MG)', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickPass();
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('copy anguish (bug report)', function () {
            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.maeoniViper);
            //first part
            this.player2.clickPrompt('Take 2 wounds');
            // second part
            this.player2.clickPrompt('Take 2 wounds');

            expect(this.maeoniViper.damage).toBe(4);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);

            this.player2.clickCard(this.aradelSummergaard);
            //first part
            this.player1.clickPrompt('Take 2 wounds');
            // second part
            this.player1.clickPrompt('Take 2 wounds');

            expect(this.aradelSummergaard.damage).toBe(4);
        });

        it('copy pb ability (water blast)', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);

            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(2);
        });

        it('skip copy pb ability (water blast)', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.ironWorker);

            this.player2.clickPass();
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('not triggered by unit ablity (blood archer)', function () {
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickPrompt('Blood Shot');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.damage).toBe(1);
            expect(this.player2).not.toBeAbleToSelect(this.copycat);
        });
    });

    describe('reaction to coal slashing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                    deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat', 'dispel'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy pb ability (coal)', function () {
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickPrompt('Slash');
            this.player1.clickCard(this.redirect); // discard
            this.player1.clickCard(this.ironWorker);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.dispel);
            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });

    describe('reaction to odette enter the fray', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'out-of-the-mist', 'cover'],
                    deck: ['molten-gold', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat', 'dispel'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy pb ability (odette)', function () {
            this.player1.clickCard(this.odetteDiamondcrest); // use ability
            this.player1.clickPrompt('Enter the Fray');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.location).toBe('discard');
            expect(this.odetteDiamondcrest.damage).toBe(2);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.maeoniViper.damage).toBe(3);
            expect(this.odetteDiamondcrest.damage).toBe(2);
        });
    });

    describe('reaction to brennen ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'ceremonial', 'charm'],
                    hand: ['molten-gold', 'out-of-the-mist', 'cover'],
                    deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['copycat', 'dispel'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });
        });

        it('copy brennen ability', function () {
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickCard(this.maeoniViper);
            expect(this.maeoniViper.damage).toBe(2);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.brennenBlackcloud);
            expect(this.ironWorker.location).toBe('discard');
            expect(this.brennenBlackcloud.damage).toBe(2);
        });

        /*it("only triggers once after brennen's ability", function () {
            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickPrompt('Spirit Burn');
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickCard(this.maeoniViper);
            expect(this.player2).toHavePrompt('Any Reactions?');

            this.player2.clickPrompt('Pass');
            expect(this.player2).not.toHavePrompt('Any Reactions?'); // failing
            expect(this.player2).not.toBeAbleToSelect(this.copycat); // failing
        });*/
    });

    describe('copies actions', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'blood-archer'],
                    dicepool: ['natural', 'natural', 'illusion', 'charm', 'charm'],
                    deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                    hand: ['open-memories', 'phoenix-barrage']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'silver-snake', 'false-demon'],
                    hand: ['copycat', 'dispel'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    deck: ['anchornaut', 'iron-worker', 'purge', 'one-hundred-blades']
                }
            });
        });

        it('check Open Memories only triggers once (bug reported, not found)', function () {
            this.player1.play(this.openMemories);
            this.player1.clickDie(0);
            this.player1.clickDone();
            this.player1.clickCard(this.moltenGold);
            expect(this.moltenGold.location).toBe('hand');

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.ironWorker);
            expect(this.ironWorker.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Phoenix Barrage triggers completely', function () {
            this.player1.play(this.phoenixBarrage);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.falseDemon);
            this.player1.clickCard(this.maeoniViper);

            expect(this.player2).toHavePrompt(
                'Any Reactions?' //menuTitle Any Reactions? for Copycat
            );

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.bloodArcher);
            this.player2.clickCard(this.coalRoarkwin);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.bloodArcher.damage).toBe(2);
            expect(this.coalRoarkwin.damage).toBe(2);
        });
    });

    describe('copy Transfer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: ['transfer'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['empower', 'summon-mist-spirit'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: ['copycat']
                }
            });
            this.ironWorker.tokens.status = 2;
            this.ironWorker.tokens.exhaustion = 1;
            this.chantOfRevenge.tokens.exhaustion = 1;
            this.summonMistSpirit.tokens.exhaustion = 1;
        });

        it('should move 1 chosen token type between cards', function () {
            expect(this.ironWorker.tokens.status).toBe(2);
            expect(this.chantOfRevenge.tokens.status).toBeUndefined();
            expect(this.summonMistSpirit.exhausted).toBe(true);

            this.player1.clickCard(this.transfer);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.ironWorker);
            this.player1.clickPrompt('Status');
            this.player1.clickCard(this.chantOfRevenge);
            expect(this.ironWorker.tokens.status).toBe(1);
            expect(this.chantOfRevenge.tokens.status).toBe(1);

            this.player2.clickCard(this.copycat);
            this.player2.clickDie(0);
            this.player2.clickCard(this.summonMistSpirit);
            // this.player2.clickPrompt('Exhaustion');
            this.player2.clickCard(this.empower);
            expect(this.summonMistSpirit.exhausted).toBe(false);
            expect(this.empower.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt;
        });
    });
});
