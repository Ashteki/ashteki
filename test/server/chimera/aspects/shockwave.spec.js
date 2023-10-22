const Dice = require('../../../../server/game/dice');

describe('Shockwave', function () {
    beforeEach(function () {
        this.setupTest({
            mode: 'solo',
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['summon-iron-rhino']
            },
            player2: {
                dummy: true,
                phoenixborn: 'frostwild-scourge',
                behaviour: 'scourge-behaviour',
                ultimate: 'scourge-ultimate',
                inPlay: ['shockwave'],
                deck: [],
                spellboard: [],
                threatZone: ['rampage'],
                dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                archives: ['stun', 'stun']
            }
        });
    });

    it('on attack attaches stun alterations', function () {
        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.shockwave.isAttacker).toBe(true);
        expect(this.game.attackState.isPBAttack).toBe(true);
        expect(this.fluteMage.upgrades.length).toBe(1);
        expect(this.anchornaut.upgrades.length).toBe(1);
    });

    it('when both targets are the same', function () {
        this.ironWorker.tokens.exhaustion = 1;
        this.fluteMage.tokens.exhaustion = 1;

        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.coalRoarkwin.damage).toBe(3);
        expect(this.fluteMage.upgrades.length).toBe(0);
        expect(this.ironWorker.upgrades.length).toBe(0);
        expect(this.anchornaut.upgrades.length).toBe(1);
    });

    it('when no targets found', function () {
        this.ironWorker.tokens.exhaustion = 1;
        this.fluteMage.tokens.exhaustion = 1;
        this.anchornaut.tokens.exhaustion = 1;

        spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack
        this.player1.endTurn();
        // informs real player of behaviour roll
        expect(this.player2).toHavePrompt('Alerting opponent');
        this.player1.clickPrompt('Ok');

        expect(this.coalRoarkwin.damage).toBe(3);
        expect(this.fluteMage.upgrades.length).toBe(0);
        expect(this.ironWorker.upgrades.length).toBe(0);
        expect(this.anchornaut.upgrades.length).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
