const Dice = require('../../../../server/game/dice');

describe('Broodmother Aspect', function () {
    describe('Status Ability', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['mist-spirit']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['broodmother'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed', 'webbed']
                }
            });

            this.broodmother.tokens.status = 3;
        });

        it('place threat on last status', function () {
            const aspectCount = this.player2.player.aspectsInPlay.length;

            this.broodmother.tokens.status = 1;
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);
        });

        it('nothing if not last status', function () {
            const aspectCount = this.player2.player.aspectsInPlay.length;

            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount);
            expect(this.broodmother.tokens.status).toBe(2);
        });
    });
});
