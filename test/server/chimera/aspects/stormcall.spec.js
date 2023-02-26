const Dice = require('../../../../server/game/dice');

describe('Stormcall Aspect', function () {
    describe('stormcall Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['stormcall', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);

        });

        it('puts card into play with 2 status', function () {
            expect(this.stormcall.location).toBe('threatZone');
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.stormcall.location).toBe('play area');
            expect(this.stormcall.status).toBe(2);
        });
    });

    describe('stormcall In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: ['stormcall'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.stormcall.tokens.status = 2;
            this.player2.dicepool.forEach(d => d.level = 'basic');
        });

        it('start of turn pay status to deal 1 damage', function () {
            expect(this.stormcall.location).toBe('play area');
            this.player1.endTurn();

            expect(this.stormcall.status).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.virosS1.redRains).toBe(0);
        });

        it('the last status also places a redrains token', function () {
            this.stormcall.tokens.status = 1;
            expect(this.stormcall.location).toBe('play area');
            this.player1.endTurn();

            expect(this.stormcall.status).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.virosS1.redRains).toBe(1);
        });
    });
});