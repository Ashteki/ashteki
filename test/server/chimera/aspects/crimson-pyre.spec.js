const Dice = require('../../../../server/game/dice');

describe('Crimson Pyre Aspect', function () {
    describe('Crimson Pyre In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['crimson-pyre', 'rainwalker'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.crimsonPyre.tokens.status = 3;
        });

        it('start of turn destroy conjured alt to force 2 damage allocation', function () {
            this.player1.endTurn();
            expect(this.crimsonPyre.status).toBe(2);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.coalRoarkwin);

            expect(this.rainwalker.location).toBe('archives');
            expect(this.ironWorker.damage).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('In Play but no conjured aspect', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['crimson-pyre'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.crimsonPyre.tokens.status = 3;
        });

        it('start of turn no effect', function () {
            this.player1.endTurn();
            expect(this.crimsonPyre.status).toBe(2);

            expect(this.ironWorker.damage).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(0);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
