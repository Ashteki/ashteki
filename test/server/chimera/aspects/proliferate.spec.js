const Dice = require('../../../../server/game/dice');

describe('Proliferate Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['false-demon', 'anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['proliferate', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('place scarlet seed into play', function () {
            expect(this.scarletSeed.location).toBe('archives');
            expect(this.proliferate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.scarletSeed.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(false);
        });
    });
});
