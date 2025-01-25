describe('Eras End', function () {
    describe('abnormal end of round event', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut'],
                    hand: ['eras-end']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald']
                }
            });
        });

        it('play triggers end round event', function () {
            this.player1.play(this.erasEnd);

            // triggers Crypt guardian
            this.player1.clickCard(this.riverSkald);

            expect(this.riverSkald.exhausted).toBe(true);
        });

        it('play doesnt trigger exhausted ability', function () {
            this.cryptGuardian.tokens.exhaustion = 1;
            this.player1.play(this.erasEnd);

            expect(this.player1).toHaveDefaultPrompt();
            // triggers NOT Crypt guardian
            this.player1.clickCard(this.riverSkald);

            expect(this.riverSkald.exhausted).toBe(false);
        });
    });

    describe('ordering', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'time'],
                    deck: ['anchornaut'],
                    hand: ['eras-end', 'reflections-in-the-water']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald', 'ruin-dweller']
                }
            });
        });

        it('play triggers end round event', function () {
            this.player1.play(this.erasEnd);

            this.player1.clickCard(this.cryptGuardian);
            // triggers Crypt guardian
            this.player1.clickCard(this.riverSkald);

            this.player2.clickCard(this.orrickGilstream);

            expect(this.riverSkald.exhausted).toBe(true);
            expect(this.orrickGilstream.damage).toBe(1);
        });

        it('crypt G vs Reflections during EE - No proc for Crypt G', function () {
            this.player1.play(this.reflectionsInTheWater);
            this.player1.clickDie(3);
            this.player1.clickCard(this.cryptGuardian);
            expect(this.cryptGuardian.upgrades.length).toBe(1);
            this.player1.player.actions.side += 1; // actions fudge

            this.player1.play(this.erasEnd);

            this.player2.clickCard(this.orrickGilstream);

            expect(this.orrickGilstream.damage).toBe(1);
            expect(this.reflectionsInTheWater.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('BUG: should snapshot eor triggers and skip new units with fleeting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rowan-umberend',
                    inPlay: ['anchornaut', 'salamander-monk'],
                    deck: ['anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    hand: ['discovery', 'discovery', 'discovery', 'purge', 'eras-end', 'devotion'],
                    archives: ['red-raindrop', 'salamander-monk-spirit']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald']
                }
            });
        });

        it('play triggers end round event', function () {
            this.player1.play(this.discovery);
            this.player1.clickCard(this.purge); // discard cost
            this.player1.clickDie(0);
            expect(this.redRaindrop.location).toBe('play area');
            expect(this.rowanUmberend.upgrades.length).toBe(1);
            this.player1.player.actions.main = true;

            this.player1.play(this.erasEnd);
            this.player1.clickCard(this.salamanderMonk);
            expect(this.salamanderMonk.location).toBe('archives');
            expect(this.salamanderMonkSpirit.location).toBe('play area');
        });
    });
});
