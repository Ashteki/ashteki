const Dice = require('../../../../server/game/dice');

describe('Giants Might Aspect', function () {
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
                    threatZone: ['giants-might', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor', 'vigor', 'vigor']
                }
            });
        });

        it('attaches vigor to self', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.giantsMight.upgrades.length).toBe(1);
            expect(this.giantsMight.location).toBe('play area');
            expect(this.giantsMight.facedown).toBe(false);
            expect(this.vigor.location).toBe('play area');
        });

        it('reveal attaches 2 vigor to self phase 2', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.giantsMight.upgrades.length).toBe(2);
            expect(this.giantsMight.location).toBe('play area');
            expect(this.giantsMight.facedown).toBe(false);
        });

        it('reveal attaches 3 vigor to self phase 3', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.giantsMight.upgrades.length).toBe(3);
            expect(this.giantsMight.location).toBe('play area');
            expect(this.giantsMight.facedown).toBe(false);
        });
    });
});
