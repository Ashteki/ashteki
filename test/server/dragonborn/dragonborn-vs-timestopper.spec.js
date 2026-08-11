const Dice = require('../../../server/game/dice');

describe('Dragonborn Timestopper bug', function () {
    describe('With no Aspects to reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['timestopper', 'purge', 'abundance']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['hunting-instincts', 'rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('should not attack with chosen aspect ', function () {
            this.player1.play(this.timestopper);
            this.player1.clickCard(this.huntingInstincts); // timestopper ability
            this.player1.endTurn();

            expect(this.rampage.isAttacker).toBe(true);
            expect(this.huntingInstincts.isAttacker).toBe(false);
            expect(this.huntingInstincts.exhausted).toBe(false);
        });
    });
});