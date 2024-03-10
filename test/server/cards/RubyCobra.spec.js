describe('Ruby Cobra', function () {
    describe('Intimidate 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('increases cobra attack and forces opponent discard', function () {
            expect(this.player2.discard.length).toBe(0);
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.rubyCobra);
            this.player1.clickDone();
            expect(this.rubyCobra.attack).toBe(1);
            expect(this.player2.discard.length).toBe(1);

            this.player2.clickDone();
            this.player1.endTurn();
            expect(this.rubyCobra.attack).toBe(0);
        });
    });

    describe('Charming ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('restrict attack from charm dice bearer', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.dieUpgrades.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();

            this.player1.endTurn();
            this.player2.clickAttack(this.rubyCobra);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
        });

        it("doesn't restrict attack from charm dice bearer when exhausted", function () {
            this.rubyCobra.tokens.exhaustion = 1; // cobra is exhausted

            // attach die
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.dieUpgrades.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
            this.player1.endTurn();

            this.player2.clickAttack(this.rubyCobra);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).toBeAbleToSelect(this.ironWorker);
        });
    });

    describe('Cobra with attachments BUG report', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time', 'natural', 'natural'],
                    spellboard: ['captivate'],
                    hand: ['will-to-survive'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('increases cobra attack and forces opponent discard', function () {
            expect(this.player2.discard.length).toBe(0);
            this.player1.clickCard(this.luluFirststone);
            this.player1.clickPrompt('Bolster');
            this.player1.clickDie(4);
            this.player1.clickCard(this.rubyCobra);
            expect(this.rubyCobra.attack).toBe(1);

            this.player1.endTurn();
            this.player2.player.actions.main = false;
            this.player2.endTurn();
            this.player1.play(this.willToSurvive, this.rubyCobra);
            expect(this.rubyCobra.attack).toBe(2); // spark and will to survive

            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.rubyCobra);
            expect(this.rubyCobra.attack).toBe(3);
            expect(this.player2.discard.length).toBe(1);

            this.player2.clickDone(); // no guard
            this.player2.clickNo(); // no counter
            this.player1.endTurn();
            expect(this.rubyCobra.attack).toBe(2); // spark and will to survive
        });
    });

    describe('Charming ability vs Chimera', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut', 'ruby-cobra'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('restrict attack from charm dice bearer', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.rampage);
            expect(this.rampage.dieUpgrades.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();

            this.player1.endTurn();
            // chimera should attack with rampage

            this.player1.clickDone(); // guard
            this.player1.clickNo(); // counter
            expect(this.rubyCobra.location).toBe('play area');
            expect(this.rubyCobra.damage).toBe(0);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
