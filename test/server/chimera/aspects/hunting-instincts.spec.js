const Dice = require('../../../../server/game/dice');

describe('Hunting Instincts', function () {
    describe('Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
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
                    threatZone: ['hunting-instincts', 'rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('puts card into play with no status', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal

            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.huntingInstincts.status).toBe(0);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('adds red rains token when destroys attacking', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(5);  // reveal then attack
            this.player1.endTurn(); // adds RR because of threat
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.anchornaut.location).toBe('discard');
            expect(this.corpseOfViros.redRains).toBe(1);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('Attack vs Ultimate AoE', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['hunting-instincts'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.corpseOfViros.tokens.redRains = 2;
        });

        it('adds red rains token when destroys attacking', function () {
            this.player1.endTurn();
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            // order AoE
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.coalRoarkwin);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.anchornaut.location).toBe('discard');
            expect(this.corpseOfViros.redRains).toBe(0);
        });
    });
});
