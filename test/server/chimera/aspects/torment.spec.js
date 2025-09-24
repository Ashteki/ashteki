const Dice = require('../../../../server/game/dice');

describe('Torment Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['purge', 'abundance', 'iron-worker', 'sympathy-pain']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['hunting-instincts', 'torment'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.torment.tokens.status = 2;
            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            this.player2.dicepool[2].level = 'basic';
            this.player2.dicepool[3].level = 'basic';
            this.player2.dicepool[4].level = 'basic';
        });

        it('start of turn rerolls single basic die to force discard - hand', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.torment.location).toBe('play area');
            this.player1.endTurn();

            expect(this.torment.status).toBe(1);

            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            this.player1.clickCard(this.shatterPulse);
            expect(this.shatterPulse.location).toBe('discard');
        });

        it('start of turn rerolls single basic die to force discard - top of deck', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.player1.discard.length).toBe(0);
            expect(this.torment.location).toBe('play area');
            this.player1.endTurn();

            expect(this.torment.status).toBe(1);

            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            this.player1.clickPrompt('Top of Deck');
            expect(this.player1.discard.length).toBe(1);
        });
    });
});