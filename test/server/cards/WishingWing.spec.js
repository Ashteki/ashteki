describe('Wishing Wing', function () {
    describe('when destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-wishing-wing'],
                    archives: [],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'wishing-wing'],
                    spellboard: ['chant-of-revenge'],
                    deck: ['remorse', 'purge', 'abundance', 'fire-archer'],
                    hand: []
                }
            });
            this.wishingWing.tokens.status = 3;
        });

        it('draw card count from 0 to status, draw 2', function () {
            this.player1.useDie(0);
            this.player1.clickCard(this.wishingWing);

            this.player2.clickPromptButton('2');
            //don't require action type selection
            expect(this.wishingWing.location).toBe('archives');
            expect(this.player2.hand.length).toBe(2);
        });

        it('draw card count from 0 to status, draw none', function () {
            this.player1.useDie(0);
            this.player1.clickCard(this.wishingWing);

            this.player2.clickPromptButton('0');
            //don't require action type selection
            expect(this.wishingWing.location).toBe('archives');
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
