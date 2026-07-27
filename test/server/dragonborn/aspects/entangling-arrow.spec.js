const Dice = require('../../../../server/game/dice');

describe('Enangling Arrow Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'indiri-aldair',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'indiri-ultimate',
                    inPlay: ['entangling-arrow'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('reroll 2 basic dice prompts to lower 2', function () {
            this.player1.endTurn();
            // attack with entangling arrow
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');

            expect(this.player1.dicepool[0].level).toBe('class');
            expect(this.player1.dicepool[1].level).toBe('class');
            this.player1.clickDone(); // blocker
            expect(this.player1).toHaveDefaultPrompt();

            expect(this.entanglingArrow.location).toBe('archives');
        });

        it('only 1 non-basic die reduces requirement', function () {
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';

            this.player1.endTurn();
            // attack with entangling arrow
            this.player1.clickDie(0);

            expect(this.player1.dicepool[0].level).toBe('class');
            expect(this.player1.dicepool[1].level).toBe('basic');
            this.player1.clickDone(); // blocker
            expect(this.player1).toHaveDefaultPrompt();

            expect(this.entanglingArrow.location).toBe('archives');
        });
    });
});
