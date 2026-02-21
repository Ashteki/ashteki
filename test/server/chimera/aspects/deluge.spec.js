const Dice = require('../../../../server/game/dice');

describe('Deluge Aspect', function () {
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
                    threatZone: ['deluge'],
                    archives: ['drowning', 'drowning'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'basic';
            this.player2.dicepool[1].level = 'basic';
            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('attach Drowning to opponents pb per chimera phase', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.deluge.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.deluge.facedown).toBe(false);
            expect(this.coalRoarkwin.upgrades.length).toBe(1);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('attach Drowning to opponents pb per chimera phase 2', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.deluge.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.deluge.facedown).toBe(false);
            expect(this.coalRoarkwin.upgrades.length).toBe(2);
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });

    });
});
