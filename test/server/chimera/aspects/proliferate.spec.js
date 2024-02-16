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
                    hand: ['summon-iron-rhino'],
                    archives: ['mist-spirit']
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

        });

        it('place scarlet seed into play', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.scarletSeed.location).toBe('archives');
            expect(this.proliferate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.scarletSeed.location).toBe('play area');
            expect(this.scarletSeed.status).toBe(3);
            expect(this.proliferate.facedown).toBe(false);
        });

        it('on behaviour 8 place scarlet seed into play and immediately use status ability', function () {
            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(8);
            expect(this.scarletSeed.location).toBe('archives');
            expect(this.proliferate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.scarletSeed.location).toBe('play area');
            expect(this.scarletSeed.status).toBe(2);
            expect(this.proliferate.facedown).toBe(false);
        });
    });

    describe('On Reveal but no seed in archives', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
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
                    inPlay: ['scarlet-seed'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['proliferate', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: []
                }
            });

            // dictate behaviour roll
            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('add a red rains token', function () {
            expect(this.scarletSeed.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.scarletSeed.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(false);
            expect(this.blightOfNeverset.redRains).toBe(1);
        });
    });
});
