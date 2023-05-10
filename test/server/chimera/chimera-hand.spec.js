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
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
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
});
