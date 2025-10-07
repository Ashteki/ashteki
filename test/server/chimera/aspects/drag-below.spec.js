const Dice = require('../../../../server/game/dice');

describe('Drag Below Aspect', function () {
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
                    inPlay: ['drag-below'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['drowning', 'drowning']
                }
            });

            this.dragBelow.tokens.status = 2;
        });

        it('attach drowning to pb', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.coalRoarkwin.getKeywordValue('drowning')).toBe(1);
        });
    });
});
