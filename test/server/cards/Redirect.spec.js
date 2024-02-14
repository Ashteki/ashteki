const Dice = require("../../../server/game/dice");

describe('Redirect reaction spell', function () {
    describe('PvP as reaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk'],
                    hand: ['one-hundred-blades', 'will-to-survive']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['redirect'],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('can be played when a phoenixborn takes attack damage', function () {
            expect(this.hammerKnight.tokens.damage).toBeUndefined;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select
            this.player2.clickPrompt('Done'); // don't place blocker

            // any interrupts?
            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            expect(this.redirect.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);

            expect(this.hammerKnight.tokens.damage).toBe(this.mistSpirit.attack);
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
            expect(this.mistSpirit.tokens.damage).toBeUndefined;
            expect(this.player2.dicepool[2].exhausted).toBe(true);
        });

        it('vs Will to survive, triggers heal', function () {
            this.aradelSummergaard.tokens.damage = 1;
            this.player1.play(this.willToSurvive, this.mistSpirit);
            expect(this.mistSpirit.attack).toBe(2);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select
            this.player2.clickPrompt('Done'); // don't place blocker

            // any interrupts?
            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickCard(this.anchornaut); // redirect damage to hammerKnight

            expect(this.redirect.location).toBe('discard');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.aradelSummergaard.damage).toBe(0);
        });

        it('can be cancelled', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select
            this.player2.clickPrompt('Done'); // don't place blocker

            // any interrupts?
            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickPrompt('Cancel');

            expect(this.redirect.location).toBe('hand');
            expect(this.coalRoarkwin.tokens.damage).toBe(this.mistSpirit.attack);
            expect(this.player2.dicepool[2].exhausted).toBe(false);
        });

        it('can be played when a phoenixborn takes One Hundred Blades damage', function () {
            expect(this.hammerKnight.tokens.damage).toBeUndefined;

            this.player1.play(this.oneHundredBlades);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.coalRoarkwin);
            // any interrupts?
            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            expect(this.redirect.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);

            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
        });
    });

    describe('vs Chimera behaviour damage', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['eternity-flame', 'blood-archer', 'shimmer-wing'],
                    spellboard: ['royal-charm'],
                    hand: ['redirect'],
                    dicepool: [
                        'charm',
                        'charm',
                        'charm',
                        'charm',
                        'charm',
                        'charm',
                        'charm',
                        'sympathy',
                        'illusion',
                        'ceremonial'
                    ]
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['hunting-instincts'],
                    deck: [],
                    threatZone: ['regenerate'],
                    dicepool: ['basic', 'basic', 'basic', 'basic', 'basic']
                }
            });

            this.eternityFlame.tokens.exhaustion = 1;
            this.eternityFlame.tokens.damage = 2;
        });

        it('can be played when a phoenixborn takes behaviour damage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll to 1 pb damage
            this.player2.player.chimeraPhase = 2;

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player1).toBeAbleToSelect(this.redirect);
            this.player1.clickCard(this.redirect);
            this.player1.clickDone(); // confirm because royal charm is out
            this.player1.clickDone(); // say no to die smuggle

            this.player1.clickCard(this.bloodArcher);
            expect(this.royalCharm.dieUpgrades.length).toBe(0);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.bloodArcher.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        // https://github.com/Ashteki/ashteki/issues/1525
        it('BUG: royal charm on redirect from behaviour damage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll to 1 pb damage
            this.player2.player.chimeraPhase = 2;

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player1).toBeAbleToSelect(this.redirect);
            this.player1.clickCard(this.redirect);
            this.player1.clickDone(); // confirm because royal charm is out
            this.player1.clickDie(0); // say yes to die smuggle

            this.player1.clickCard(this.bloodArcher);
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.bloodArcher.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
