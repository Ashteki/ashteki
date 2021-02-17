describe('law of Assurance', function () {
    describe('law of assurance in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['law-of-assurance', 'freezing-blast', 'anchornaut']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    spellboard: [],
                    hand: ['rins-fury', 'shatter-pulse'],
                    dicepool: ['sympathy', 'sympathy', 'sympathy', 'sympathy', 'natural', 'natural']
                }
            });
        });

        it('sets all active dice to class when played', function () {
            this.player1.clickCard(this.lawOfAssurance); // target
            this.player1.clickPrompt('Play this ready spell');
            const activeDice = this.player1.dicepool.filter((d) => !d.exhausted);
            expect(activeDice.length).toBe(5);
            expect(activeDice.every((d) => d.level === 'class'));
        });

        // it('stops opponents dice being rerolled', function () {
        //     this.player1.clickCard(this.lawOfAssurance); // target
        //     this.player1.clickPrompt('Play this ready spell');
        //     this.player1.clickCard(this.anchornaut);
        //     this.player1.clickPrompt('Play this Ally');
        //     this.player1.clickDie(3);
        //     this.player1.clickCard(this.mistSpirit);

        //     expect(this.player2).toHavePrompt('Any reactions to mist spirit being destroyed?');
        //     this.player2.clickCard(this.shatterPulse);
        //     this.player2.clickDie(4);
        //     this.player1.clickCard(this.anchornaut);

        //     expect(this.player2).toHavePrompt('Any reactions to mist spirit being destroyed?');
        // });

        // it('stops opponents dice being set', function () {

        // });
    });

    describe('law of assurance in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    spellboard: ['law-of-assurance', 'summon-gilder'],
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
            expect(this.player1).not.toBeAbleToSelect(this.lawOfAssurance);
            expect(this.player1).toBeAbleToSelect(this.summonGilder);
        });

        it('is discarded at end of round', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.lawOfAssurance.location).toBe('discard');
        });
    });
});
