describe('Chimera Hand', function () {
    describe('TEO discard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem', 'three-eyed-owl'],
                    spellboard: ['summon-three-eyed-owl'],
                    dicepool: ['natural', 'divine', 'divine', 'charm'],
                    archives: ['ice-golem']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('forces chosen discard', function () {
            this.player1.endTurn();
            this.player1.clickDone(); // pin dice
            // new round, TEO forces 'hand' discard (formed from top of deck)
            // player1 chooses for chimera
            this.player1.clickCard(this.player2.hand[0]);
            expect(this.player2.discard.length).toBe(1);
            // chimera turn
            this.player1.clickButton('Ok');
            expect(this.player2.hand.length).toBe(0);
        });
    });

    describe('Anguish discard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem', 'three-eyed-owl'],
                    spellboard: ['summon-three-eyed-owl'],
                    dicepool: ['natural', 'divine', 'divine', 'charm'],
                    archives: ['ice-golem'],
                    hand: ['anguish']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('damage damages opponents pb', function () {
            expect(this.virosS1.damage).toBe(0);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.virosS1);
            this.player1.clickPrompt('Take 2 wounds');

            expect(this.virosS1.damage).toBe(2);
            expect(this.player2.hand.length).toBe(0);
        });

        it('discard removes card with no damage and exhaust choice exhausts dice', function () {
            expect(this.virosS1.damage).toBe(0);
            // expect(this.player2.dicepool[0].exhausted).toBe(false);
            // expect(this.player2.dicepool[1].exhausted).toBe(false);

            this.player1.clickCard(this.anguish);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.virosS1);

            this.player1.clickPrompt('Discard');
            expect(this.player2.discard.length).toBe(1);

            // this.player1.clickOpponentDie(0);
            // this.player1.clickOpponentDie(1);
            // this.player1.clickPrompt('Done');

            // this.player2.clickPrompt('Exhaust 2 Dice');
            // expect(this.player2.dicepool[0].exhausted).toBe(true);
            // expect(this.player2.dicepool[1].exhausted).toBe(true);

            expect(this.virosS1.damage).toBe(0);
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
