describe('AoE multi-target', function () {
    describe('on destroy and final cry', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion'],
                    hand: ['mist-typhoon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'mist-spirit', 'mist-spirit'],
                    spellboard: [],
                    hand: ['final-cry'],
                    dicepool: [
                        'natural',
                        'natural',
                        'illusion',
                        'illusion',
                        'ceremonial',
                        'ceremonial'
                    ]
                }
            });
        });

        it('should not test for multi-card trigger resolution on destruction', function () {
            expect(this.ironWorker.damage).toBe(0);

            this.player1.play(this.mistTyphoon);

            expect(this.ironWorker.damage).toBe(1);

            this.player2.clickCard(this.finalCry);
            // select a card to affect - can we make this friendlier?
            // this.player2.clickCard('mist-spirit');
            // because both cards have been destroyed
            expect(this.player2).not.toHavePrompt('Select a card to affect');

            this.player1.clickPrompt('Yes'); // draw a card
            expect(this.player1.hand.length).toBe(1);
        });
    });

    describe('on damage and particle shield', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion'],
                    hand: ['mist-typhoon']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: [],
                    hand: ['particle-shield'],
                    dicepool: [
                        'natural',
                        'natural',
                        'illusion',
                        'illusion',
                        'ceremonial',
                        'ceremonial'
                    ]
                }
            });
        });

        it('should prompt for multi-card trigger resolution', function () {
            this.player1.play(this.mistTyphoon);
            // particle shield is an interrupt
            this.player2.clickCard(this.particleShield);
            // select a card to affect
            this.player2.clickCard(this.ironWorker);

            expect(this.ironWorker.damage).toBe(0);
            expect(this.hammerKnight.damage).toBe(1);

            this.player1.clickPrompt('Yes'); // draw a card
        });
    });
});
