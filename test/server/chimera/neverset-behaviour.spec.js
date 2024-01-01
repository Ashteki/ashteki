const Dice = require('../../../server/game/dice');

describe('Blight of Neverset Behaviour Rolls', function () {
    describe('Phase 1', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed', 'scarlet-seed']
                }
            });
        });

        it('6 raise a die then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(6); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            this.player2.dicepool.forEach((d) => (d.level = 'basic'));

            expect(this.regenerate.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            // >= because could be 1 or 2 (rageroll plus behaviour roll)
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(2);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('10 attach a bleed to opp leftmost then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.hammerKnight.damage).toBe(0);

            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.hammerKnight.upgrades.length).toBe(1);
            expect(this.bleed.parent).toBe(this.hammerKnight);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);

            // bleed damages at end of turn
            this.player1.player.actions.main = false;
            this.player1.endTurn();
            expect(this.hammerKnight.damage).toBe(1);
        });

        it('12 add scarlet seed then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            expect(this.scarletSeed.location).toBe('archives');

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.scarletSeed.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('Phase 1, no seed', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed']
                }
            });
        });

        it('12 add red rains token then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(1);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('Phase 1, status abilities', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['regenerate'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed', 'scarlet-seed']
                }
            });
        });

        it('8, reveal then use rightmost status ability', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.rampage.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.player.actions.main = false; // prevent rage die bonus roll (pass on threat)
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            this.player1.clickPrompt('Ok');
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            expect(this.rampage.facedown).toBe(false);
            expect(this.rampage.status).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(6); // for each basic rage die on rampage reroll
        });
    });

    describe('Phase 1, status abilities - existing', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['regenerate', 'scarlet-seed', 'charge-fist'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['crushing-grip'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed', 'scarlet-seed']
                }
            });
            this.chargeFist.tokens.status = 3;
            this.scarletSeed.tokens.status = 3;
        });

        it('8, reveal then use rightmost status ability - in play', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.crushingGrip.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.player.actions.main = false; // prevent rage die bonus roll (pass on threat)
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            this.player1.clickPrompt('Ok');
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            expect(this.crushingGrip.facedown).toBe(false);
            expect(this.chargeFist.status).toBe(1);
            expect(this.scarletSeed.status).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1); // for each basic rage die on rampage reroll
        });
    });

    describe('Phase 1, status abilities - none', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['regenerate'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['crushing-grip'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed', 'scarlet-seed']
                }
            });
        });

        it('8, reveal then no status ability found', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.crushingGrip.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.player.actions.main = false; // prevent rage die bonus roll (pass on threat)
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            this.player1.clickPrompt('Ok');
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);
            expect(this.crushingGrip.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1); // for each basic rage die on rampage reroll
        });
    });
});
