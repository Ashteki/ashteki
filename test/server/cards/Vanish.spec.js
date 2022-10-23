describe('Vanish', function () {
    describe('', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                    hand: ['molten-gold', 'one-hundred-blades', 'phoenix-barrage']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('cancels one hundred blades', function () {
            this.player1.clickCard(this.oneHundredBlades);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt(
                'Any Reactions to one hundred blades targetting Rin Northfell?'
            );
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cancels molten gold on phoenixborn', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt('Any Reactions to molten gold targetting rin northfell?');
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cancels song of sorrow part 2', function () {
            const handSize = this.player2.hand.length;
            this.player1.clickCard(this.enchantedViolinist);
            this.player1.clickPrompt('Song Of Sorrow');
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.location).toBe('archives');

            //expect(this.player2).toHavePrompt(
            //    'Any Reactions to Song of Sorrow targetting mist spirit?'
            //);

            expect(this.player2).toHavePrompt(
                'Any Reactions to Enchanted Violinist targetting you?'
            );

            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.hand.length).toBe(handSize - 1);
        });

        it('cancels Phoenix Barrage part 3', function () {
            this.player1.play(this.phoenixBarrage);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.hammerKnight);
            //this.player1.clickCard(this.mistSpirit);
            //expect(this.mistSpirit.location).toBe('archives');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt(
                'Any Reactions to Phoenix Barrage targetting Rin Northfell?'
            );
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['enchanted-violinist', 'dreamlock-mage'],
                    spellboard: ['magic-syphon', 'summon-blood-puppet'],
                    dicepool: ['ceremonial', 'natural', 'natural', 'charm', 'illusion'],
                    hand: ['anguish', 'one-hundred-blades'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('should cancel blood puppet', function () {
            expect(this.player1.dicepool[0].exhausted).toBe(false);
            this.player1.useAbility(this.summonBloodPuppet);
            this.player1.clickPrompt("Opponent's");

            expect(this.player2).toHavePrompt('Any Reactions to summon blood puppet?');
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            // summon is cancelled
            expect(this.bloodPuppet.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.dicepool[0].exhausted).toBe(true); // dice still spent
        });

        it('should cancel anguish', function () {
            const handSize = this.player2.hand.length;
            this.player1.play(this.anguish);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt('Any Reactions to anguish targetting rin northfell?');
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.hand.length).toBe(handSize - 1);
        });

        it('should cancel magic syphon', function () {
            this.player1.clickCard(this.magicSyphon);
            this.player1.clickPrompt('Magic Syphon');

            this.player1.clickDie(1);
            this.player1.clickDie(1);
            expect(this.player1.dicepool[1].level).toBe('class');
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('player2');
            expect(this.player2).toHavePrompt('Any Reactions to magic syphon targetting you?');
            this.player2.clickCard(this.vanish);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('should cancel dreamlock mage power', function () {
            this.player1.clickCard(this.dreamlockMage);
            this.player1.clickPrompt('Restrict 1');
            this.player1.clickOpponentDie(1);
            expect(this.player2).toHavePrompt('Any Reactions to Restrict 1?');
            this.player2.clickCard(this.vanish);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.dicepool[1].level).toBe('power');
        });

        it('should cancel illusion die power', function () {
            this.player1.clickDie(4);
            this.player1.clickPrompt('Illusion Dice Power');
            this.player1.clickOpponentDie(1);
            this.player1.clickOpponentDie(2);
            this.player1.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Any Reactions to Illusion Dice Power?');
            this.player2.clickCard(this.vanish);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.dicepool[1].level).toBe('power');
            expect(this.player2.dicepool[2].level).toBe('power');
        });
    });

    describe('interaction with final cry', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['butterfly-monk'],
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'natural', 'natural', 'charm'],
                    hand: ['final-cry', 'blood-chains'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['emperor-lion'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish']
                }
            });

            this.leoSunshadow.damage = 1;
        });

        it('FC should trigger vanish', function () {
            this.player1.clickCard(this.bloodChains);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.butterflyMonk); // destroy my unit
            this.player1.clickCard(this.leoSunshadow);
            expect(this.leoSunshadow.damage).toBe(0);

            // reaction
            this.player1.clickCard(this.finalCry);

            expect(this.player2).toHavePrompt('Any Reactions to final cry targetting rin northfell?');
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            this.player1.clickCard(this.emperorLion); // BC exhaust

            expect(this.player1).toHaveDefaultPrompt();
        });
    });


    describe('vs Jessa Screams', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'natural', 'charm', 'illusion'],
                    hand: ['fear', 'one-hundred-blades']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('should cancel screams', function () {
            const handSize = this.player2.hand.length;
            this.player1.play(this.fear);
            this.player1.clickDie(0);
            this.player1.clickCard(this.enchantedViolinist);
            this.player1.clickCard(this.jessaNaNi);
            this.player1.clickDie(1);

            expect(this.player2).toHavePrompt('Any Reactions to Screams of the Departed targetting rin northfell?');
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            this.player1.clickCard(this.mistSpirit);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player2.hand.length).toBe(handSize - 1);
        });
    });

    describe('vs Light Bringer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'divine', 'charm', 'illusion'],
                    hand: ['fear', 'one-hundred-blades'],
                    spellboard: ['summon-light-bringer'],
                    archives: ['light-bringer']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('interaction with lightbringer effect should trigger vanish', function () {
            this.player1.clickCard(this.summonLightBringer);
            this.player1.clickPrompt('Summon Light Bringer');

            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);
            expect(this.player1.player.anyEffect('mustAttack')).toBe(false); // No LB lasting effect
        });
    });

    describe('vs Sarias Hearts Pull', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'divine', 'charm', 'illusion'],
                    hand: ['fear', 'one-hundred-blades']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('hearts pull should trigger vanish', function () {
            const deckSize = this.player2.deck.length;
            expect(deckSize).toBeGreaterThan(0);
            this.player1.clickCard(this.sariaGuideman);
            this.player1.clickPrompt("Heart's Pull");
            this.player1.clickYes();
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            expect(this.player1.deck.length).toBe(deckSize);
        });
    });

    describe('BUG: vs Group Tactics', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['enchanted-violinist', 'raptor-hatchling', 'mist-spirit'],
                    dicepool: ['ceremonial', 'natural', 'divine', 'charm', 'illusion'],
                    hand: ['fear', 'one-hundred-blades']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('GT should not trigger vanish', function () {
            this.player1.clickAttack(this.rinNorthfell);

            this.player1.clickCard(this.enchantedViolinist);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.raptorHatchling);
            this.player1.clickDone();
            this.player1.clickYes();
            expect(this.player2).not.toBeAbleToSelect(this.vanish);
            //this.player2.clickCard(this.vanish);
            expect(this.player2).toHavePrompt('Choose a blocker');
        });
    });
});
