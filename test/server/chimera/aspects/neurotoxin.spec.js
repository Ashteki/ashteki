const Dice = require('../../../../server/game/dice');

describe('Neurotoxin Aspect', function () {
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
                    inPlay: ['neurotoxin'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed', 'webbed']
                }
            });

            this.neurotoxin.tokens.status = 2;
        });

        it('damage opponents pb when not last status', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.anchornaut.location).toBe('play area');
        });

        it('damage opponents pb and exhaust die when last status', function () {
            this.neurotoxin.tokens.status = 1;
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal hunting-instincts
            expect(this.player1.dicepool[0].exhausted).toBe(false);
            this.player1.endTurn();
            this.player1.clickDie(0);
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1.dicepool[0].exhausted).toBe(true);
        });
    });
});
