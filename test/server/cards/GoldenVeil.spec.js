describe('Golden Veil', function () {
    describe('as p2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: [
                        'ceremonial',
                        'natural',
                        'natural',
                        'illusion',
                        'charm',
                        'sympathy',
                        'sympathy',
                        'divine'
                    ],
                    hand: ['molten-gold', 'fade-away', 'river-skald', 'mist-typhoon', 'kneel']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['charm', 'natural'],
                    hand: ['golden-veil', 'rins-fury']
                }
            });
        });

        it('cancels molten gold on unit', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt(
                'Any Reactions to molten gold targetting Hammer Knight?'
            );
            this.player2.clickCard(this.goldenVeil);

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.moltenGold.location).toBe('discard');
        });

        it('cannot cancel mist typhoon AoE - no target', function () {
            this.player1.clickCard(this.mistTyphoon);
            this.player1.clickPrompt('Play this action');

            expect(this.player2).not.toHavePrompt('Any Reactions to mist Typhoon?');
            expect(this.player2).not.toBeAbleToSelect(this.goldenVeil);

            this.player1.clickYes(); // draw a card
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.mistTyphoon.location).toBe('discard');
        });

        it('cannot cancel kneel - no target', function () {
            this.player1.clickCard(this.kneel);
            this.player1.clickPrompt('Play this action');

            expect(this.player2).not.toHavePrompt('Any Reactions to Kneel?');
            expect(this.player2).not.toBeAbleToSelect(this.goldenVeil);

            expect(this.hammerKnight.exhaustion).toBe(1);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.kneel.location).toBe('discard');
        });

        it('cancels natural dice power', function () {
            this.player1.clickDie(1);
            this.player1.clickPrompt('Natural Dice Power');
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt(
                'Any Reactions to natural dice power targetting hammer knight?'
            );
            this.player2.clickCard(this.goldenVeil);

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.dicepool[1].exhausted).toBe(true);
        });

        it('cancels charm dice power', function () {
            this.player1.clickDie(4);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt(
                'Any Reactions to charm dice power targetting hammer knight?'
            );
            this.player2.clickCard(this.goldenVeil);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.hammerKnight.dieUpgrades.length).toBe(0);
            expect(this.player1.dicepool[4].exhausted).toBe(true);
        });

        it('cancels alteration spell attachment to unit', function () {
            this.player1.clickCard(this.fadeAway);
            this.player1.clickPrompt('Play this alteration');
            this.player1.clickCard(this.hammerKnight);

            // expect(this.player2).toHavePrompt('Any Reactions to molten gold?');
            this.player2.clickCard(this.goldenVeil);

            expect(this.hammerKnight.upgrades.length).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.fadeAway.location).toBe('discard');
        });

        it('cancels multi-target ability - Maeoni', function () {
            this.player1.clickCard(this.maeoniViper);
            this.player1.clickPrompt('Command Strike');
            this.player1.clickDie(0);
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt(
                'Any Reactions to command strike targetting hammer knight?'
            );
            this.player2.clickCard(this.goldenVeil);

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cancels river skald without cost refund (discard)', function () {
            this.player1.play(this.riverSkald);
            this.player1.clickYes();
            this.player1.clickCard(this.moltenGold);
            this.player1.clickCard(this.hammerKnight);
            this.player2.clickCard(this.goldenVeil);

            expect(this.hammerKnight.damage).toBe(0);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.moltenGold.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Golden Veil', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: [
                        'ceremonial',
                        'natural',
                        'natural',
                        'illusion',
                        'charm',
                        'sympathy',
                        'sympathy'
                    ],
                    hand: ['river-skald', 'golden-veil']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['charm', 'natural'],
                    hand: ['rins-fury']
                }
            });
        });

        it('cancels part of rins fury (last part)', function () {
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone(); // no guard
            this.player2.clickNo(); // no counter, so ironWorker is not destroyed by HK

            this.player2.clickCard(this.rinsFury); // prevent damage to hammer Knight
            this.player2.clickDie(0);
            this.player2.clickDie(1);
            this.player2.clickDone(); // wants to destroy ironWorker
            // this.player2.clickCard(this.ironWorker);
            expect(this.player1).not.toHaveDefaultPrompt();
            expect(this.player1).toBeAbleToSelect(this.goldenVeil);
            this.player1.clickCard(this.goldenVeil); // prevent ironWorker destruction
            expect(this.ironWorker.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(0); // but first part of fury still happens
        });
    });
});
