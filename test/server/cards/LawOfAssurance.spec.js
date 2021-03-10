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
    });

    describe('law of assurance in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['illusion', 'natural', 'sympathy', 'sympathy', 'ceremonial'],
                    spellboard: ['law-of-assurance', 'magic-syphon', 'summon-gilder'],
                    hand: ['call-upon-the-realms']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    hand: ['rins-fury'],
                    dicepool: ['illusion', 'illusion']
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

        it('stops opponents dice being lowered by illusion dice power', function () {
            this.player1.clickDie(0); // illusion die
            expect(this.player1).not.toHavePrompt('Illusion Power Die');
        });

        it('stops opponents dice being changed by ChangeDiceAction', function () {
            this.player1.clickCard(this.magicSyphon);
            this.player1.clickPrompt('Magic Syphon');
            this.player1.clickDie(0);
            this.player1.clickPrompt('done');
            expect(this.player1).toBeAbleToSelectDie(this.player1.dicepool[0]);
            expect(this.player1).not.toBeAbleToSelectDie(this.player2.dicepool[0]);
        });

        it('does not stop own dice being changed by ChangeDiceAction', function () {
            this.player1.clickCard(this.callUponTheRealms);
            expect(this.player1).toHavePromptButton('Play this action');
        });
    });
});
