const Dice = require('../../../../server/game/dice');

describe('Stunning Impact Aspect', function () {
    describe('With targets in spellboard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: ['abundance', 'strengthen'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['stunning-impact'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });
        });

        it('on attack forces ready spell return to hand', function () {
            this.strengthen.exhaust();
            expect(this.blightOfNeverset.redRains).toBe(0);
            this.player1.endTurn();
            // chimera attacks
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.player1).not.toHavePromptTitle('Attack');
            expect(this.player1).not.toBeAbleToSelect(this.strengthen);

            this.player1.clickCard(this.abundance);
            expect(this.abundance.location).toBe('hand');
        });
    });

    describe('With no spellboard target', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: ['strengthen'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['stunning-impact'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });
        });

        it('no prompt', function () {
            this.strengthen.exhaust();
            expect(this.blightOfNeverset.redRains).toBe(0);
            this.player1.endTurn();
            // chimera attacks
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.strengthen);
            expect(this.player1).toHavePromptTitle('Attack');
        });
    });

    describe('BUG: vs Summon Turtle Guard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'harold-westraven',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'time', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino', 'summon-turtle-guard'],
                    archives: ['turtle-guard']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'flood-of-moon-cove',
                    behaviour: 'moon-cove-behaviour',
                    ultimate: 'moon-cove-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['stunning-impact'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });
            // reveal attack
            spyOn(Dice, 'd12Roll').and.returnValue(5);
        });

        it('on attack forces ready spell return to hand', function () {
            this.player1.play(this.summonTurtleGuard);
            this.player1.clickDie(4);
            expect(this.summonTurtleGuard.location).toBe('spellboard');
            this.player1.endTurn();
            // chimera attacks
            this.player1.clickOk(); // behaviour alert
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.player1).not.toHavePromptTitle('Attack');

            this.player1.clickCard(this.summonTurtleGuard);
            expect(this.summonTurtleGuard.location).toBe('hand');
        });
    });

});
