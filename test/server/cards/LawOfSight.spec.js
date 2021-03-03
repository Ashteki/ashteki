describe('law of sight', function () {
    describe('law of sight in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['law-of-sight', 'freezing-blast']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('gives draw prompt when played', function () {
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.lawOfSight);
            this.player1.clickPrompt('Play this ready spell');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes'); // draw

            this.player1.clickPrompt('1');
            expect(this.player1.hand.length).toBe(hand); // -1 for playing card, +1 for draw
        });

        it('stops reaction spells being played', function () {
            this.player1.clickCard(this.lawOfSight); // target
            this.player1.clickPrompt('Play this ready spell');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('No'); // draw

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.hammerKnight); // target
            this.player1.clickCard(this.ironWorker); // single attacker

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter

            expect(this.player2).not.toBeAbleToSelect(this.rinsFury);
        });
    });

    describe('law of sight in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    spellboard: ['law-of-sight', 'summon-gilder'],
                    hand: ['freezing-blast']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('cannot be meditated from spellboard', function () {
            this.player1.clickPrompt('Meditate');
            expect(this.player1).not.toBeAbleToSelect(this.lawOfSight);
            expect(this.player1).toBeAbleToSelect(this.summonGilder);
        });
    });
});
