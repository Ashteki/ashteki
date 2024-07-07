describe('Strange Copy', function () {
    describe('reaction spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['silver-snake', 'iron-worker', 'iron-rhino', 'frostback-bear'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'divine', 'divine'],
                    archives: ['butterfly-monk'],
                    hand: ['holy-relics']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'salamander-monk', 'blood-archer'],
                    hand: ['strange-copy'],
                    dicepool: ['illusion']
                }
            });
            this.silverSnake.tokens.status = 4;
        });

        it('copies base attack value iron rhino', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            expect(this.player2).toBeAbleToSelect(this.strangeCopy);

            this.player2.clickCard(this.strangeCopy); // guard with pb
            this.player2.clickDie(0);

            this.player2.clickCard(this.fluteMage); // my unit

            expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
            expect(this.player2).toBeAbleToSelect(this.ironRhino);
            this.player2.clickCard(this.ironRhino); // unit to copy

            // card played
            expect(this.strangeCopy.location).toBe('discard');
            expect(this.fluteMage.attack).toBe(7);
            expect(this.fluteMage.life).toBe(4);
            expect(this.fluteMage.recover).toBe(0);

            // end attack sequence
            this.player2.clickDone(); // no guard
            this.player2.clickYes(); // counter

            expect(this.ironWorker.location).toBe('discard');
            expect(this.fluteMage.location).toBe('play area');
            expect(this.fluteMage.damage).toBe(2);

            // effect ends at turn end
            this.player1.endTurn();
            expect(this.fluteMage.location).toBe('discard');
            expect(this.fluteMage.attack).toBe(1);
        });

        it('copies base attack value without alterations', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();

            this.player1.play(this.holyRelics, this.ironWorker);
            expect(this.ironWorker.attack).toBe(4);
            this.player1.actions.main = true; // BODGE

            this.player1.clickPrompt('Attack', true);
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            expect(this.player2).toBeAbleToSelect(this.strangeCopy);

            this.player2.clickCard(this.strangeCopy); // guard with pb
            this.player2.clickDie(0);

            this.player2.clickCard(this.fluteMage); // my unit

            expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
            this.player2.clickCard(this.ironWorker); // unit to copy

            // card played
            expect(this.strangeCopy.location).toBe('discard');

            // copies selected unit values WITHOUT alterations
            expect(this.fluteMage.attack).toBe(2);
            expect(this.fluteMage.life).toBe(2);
            expect(this.fluteMage.recover).toBe(1);

            // add further tests for abilities etc
        });

        it('copies X attack value - silver snake', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            expect(this.player2).toBeAbleToSelect(this.strangeCopy);

            this.player2.clickCard(this.strangeCopy); // guard with pb
            this.player2.clickDie(0);

            this.player2.clickCard(this.fluteMage); // my unit
            expect(this.player2).toBeAbleToSelect(this.silverSnake);
            expect(this.silverSnake.attack).toBe(4);
            this.player2.clickCard(this.silverSnake); // click cover to play as reaction

            // card played
            expect(this.strangeCopy.location).toBe('discard');
            expect(this.fluteMage.attack).toBe(4);
            expect(this.fluteMage.life).toBe(4);
            expect(this.fluteMage.recover).toBe(3);

            // add further tests for abilities etc
        });

        it('Bug report - sal and FBB counter damage', function () {
            expect(this.fluteMage.tokens.damage).toBeUndefined();

            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear); // single attacker
            this.player1.clickDone();

            expect(this.player2).toBeAbleToSelect(this.strangeCopy);

            this.player2.clickCard(this.strangeCopy); // guard with pb
            this.player2.clickDie(0);

            this.player2.clickCard(this.salamanderMonk); // my unit
            expect(this.player2).toBeAbleToSelect(this.bloodArcher);
            expect(this.bloodArcher.attack).toBe(3);
            this.player2.clickCard(this.bloodArcher); // click cover to play as reaction

            // card played
            expect(this.strangeCopy.location).toBe('discard');
            expect(this.salamanderMonk.attack).toBe(3);
            expect(this.salamanderMonk.life).toBe(3);
            expect(this.salamanderMonk.recover).toBe(2);

            // add further tests for abilities etc
            this.player2.clickCard(this.bloodArcher);
            this.player2.clickCard(this.frostbackBear);
            this.player2.clickDone(); // blockers

            expect(this.frostbackBear.location).toBe('archives');
        });
    });

    describe('Bug: strange copy paladin to swallow', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['silver-snake', 'iron-worker', 'silver-paladin', 'anchornaut'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'divine', 'divine'],
                    archives: ['butterfly-monk'],
                    hand: ['holy-relics']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightshade-swallow', 'salamander-monk', 'blood-archer'],
                    hand: ['strange-copy'],
                    spellboard: ['summon-nightshade-swallow'],
                    dicepool: ['illusion', 'charm', 'charm']
                }
            });
            this.silverSnake.tokens.status = 4;
        });

        it('copy paladin', function () {
            expect(this.nightshadeSwallow.tokens.damage).toBeUndefined();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.nightshadeSwallow); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            this.player2.clickCard(this.strangeCopy); // guard with pb
            this.player2.clickDie(0);

            this.player2.clickCard(this.nightshadeSwallow); // my unit
            this.player2.clickCard(this.silverPaladin); // unit to copy

            // card played
            expect(this.strangeCopy.location).toBe('discard');
            expect(this.nightshadeSwallow.attack).toBe(3);
            expect(this.nightshadeSwallow.life).toBe(5);
            expect(this.nightshadeSwallow.recover).toBe(2);

            // end attack sequence
            this.player2.clickDone(); // no guard
            this.player2.clickYes(); // counter

            expect(this.ironWorker.location).toBe('discard');
            expect(this.nightshadeSwallow.location).toBe('play area');
            expect(this.nightshadeSwallow.damage).toBe(2);

            // effect ends at turn end
            this.player1.endTurn();
            expect(this.nightshadeSwallow.location).toBe('archives');
            expect(this.nightshadeSwallow.attack).toBe(1);

            this.player2.clickCard(this.summonNightshadeSwallow);
            this.player2.clickPrompt('Summon Nightshade Swallow');

            expect(this.nightshadeSwallow.location).toBe('play area');
            expect(this.nightshadeSwallow.attack).toBe(1);

            expect(this.player2).toHaveDefaultPrompt(); // (not ETF for paladin)
        });
    });
});
