const Dice = require('../../../../server/game/dice');

describe('Undertow Aspect', function () {
    describe('On reveal first time', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['undertow'],
                    archives: ['drowning', 'drowning'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('attach Drowning to opponents pb, reroll 1 die', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.undertow.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.undertow.facedown).toBe(false);
            expect(this.coalRoarkwin.upgrades.length).toBe(1);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(2); // behaviour 1 + 1 reroll

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('drowning stacks, removed with dice lower', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            this.player2.attachPbUpgrade(this.drowning, this.coalRoarkwin);
            expect(this.drowning.parent).toBe(this.coalRoarkwin);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
            expect(this.undertow.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.undertow.facedown).toBe(false);
            expect(this.coalRoarkwin.upgrades.length).toBe(2);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(2);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(3); // behaviour 1 + 2 reroll for drowningLevel

            expect(this.player1).toHaveDefaultPrompt();
            this.player1.useCardAbility(this.drowning, 'Gasp for air');
            this.player1.clickDie(0);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
        });

        it('drowning plus life ends the game', function () {
            this.coalRoarkwin.tokens.damage = 13; // of 15
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            this.player2.attachPbUpgrade(this.drowning, this.coalRoarkwin);
            expect(this.drowning.parent).toBe(this.coalRoarkwin);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
            expect(this.undertow.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.undertow.facedown).toBe(false);
            expect(this.coalRoarkwin.upgrades.length).toBe(2);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(2);

            expect(this.game.winner).toBe(this.player2.player);
            expect(this.player1).toHavePromptTitle('Game Won');
        });
    });
});
