const Dice = require('../../../../server/game/dice');

describe('Storm Bolt Aspect', function () {
    describe('On Reveal', function () {
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
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun']
                }
            });
        });

        it('reveal attaches stun to rightmost unit', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.ironWorker.upgrades.length).toBe(1);
            expect(this.ironWorker.exhausted).toBe(true);

            this.player1.clickCard(this.stun);
            this.player1.clickPrompt('Unstun');
            expect(this.stormBolt.location).toBe('play area');
            expect(this.stormBolt.facedown).toBe(false);
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.ironWorker.upgrades.length).toBe(0);
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.stun.location).toBe('archives');
        });

        it('reveal damages pb is no unexhausted unit', function () {
            this.ironWorker.tokens.exhaustion = 1;
            this.anchornaut.tokens.exhaustion = 1;
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.ironWorker.upgrades.length).toBe(0);
            expect(this.anchornaut.upgrades.length).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.stormBolt.location).toBe('play area');
            expect(this.stormBolt.facedown).toBe(false);
        });
    });
});
