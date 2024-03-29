describe('Fate Reflection', function () {
    describe('Fate Reflection reaction spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage', 'hammer-knight', 'squall-stallion'],
                    spellboard: [],
                    hand: ['anchornaut', 'seeds-of-aggression'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'time'],
                    archives: ['butterfly-monk'],
                    hand: ['fate-reflection']
                }
            });
        });

        it('can be played when a unit takes damage', function () {
            expect(this.ironWorker.damage).toBe(0);

            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Play This Ally');
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironWorker); // target

            // any interrupts?
            expect(this.player2).toHavePrompt(
                'Any Reactions to Iron Worker receiving 1 damage from Anchornaut?'
            );
            this.player2.clickCard(this.fateReflection); // click fate reflection to play as reaction
            this.player2.clickDie(4);
            this.player2.clickCard(this.hammerKnight); // deal damage to hammerKnight

            expect(this.fateReflection.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);

            expect(this.hammerKnight.damage).toBe(1); // apply correct damage
            expect(this.ironWorker.damage).toBe(0);
        });

        it('can be played when a unit takes Water Blast damage', function () {
            expect(this.ironWorker.damage).toBe(0);

            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.ironWorker);

            // any interrupts?
            expect(this.player2).toHavePrompt(
                'Any Reactions to Iron Worker receiving 2 damage from Aradel Summergaard?'
            );
            this.player2.clickCard(this.fateReflection); // click fate reflection to play as reaction
            this.player2.clickDie(4);
            // check for squall stallion / lightning speed
            expect(this.player2).not.toBeAbleToSelect(this.squallStallion);
            this.player2.clickCard(this.hammerKnight); // deal damage to hammerKnight

            expect(this.fateReflection.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);

            expect(this.hammerKnight.damage).toBe(2); // apply correct damage
            expect(this.ironWorker.damage).toBe(0);
        });

        it('cannot be played when an opposing unit takes damage', function () {
            expect(this.ironWorker.damage).toBe(0);

            this.player1.clickCard(this.anchornaut);
            this.player1.clickPrompt('Play This Ally');
            this.player1.clickDie(2);
            this.player1.clickCard(this.hammerKnight); // target

            // expect no interrupts
            expect(this.player2).not.toHavePrompt(
                'Any Reactions to Hammer Knight receiving 1 damage from Anchornaut?'
            );
            expect(this.player2).not.toBeAbleToSelect(this.fateReflection);
        });

        it('cannot be played against seeds of aggression', function () {
            expect(this.ironWorker.damage).toBe(0);

            this.player1.play(this.seedsOfAggression);
            this.player1.clickDie(3);
            this.player1.clickDie(4);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);

            // expect no interrupts
            expect(this.player2).not.toBeAbleToSelect(this.fateReflection);
        });
    });

    describe('BUG: Fate Reflection vs Meteor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    spellboard: [],
                    hand: ['anchornaut', 'meteor'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'divine', 'divine']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'time'],
                    archives: ['butterfly-monk'],
                    hand: ['fate-reflection']
                }
            });
        });

        it('BUG: fate reflection vs Meteor', function () {
            this.player1.dicepool[5].level = 'class';

            this.player1.play(this.meteor);
            this.player1.clickDie(4);
            this.player1.clickDie(5);
            this.player1.clickDone();
            this.player1.clickCard(this.ironWorker);
            // any interrupts?
            this.player2.clickCard(this.fateReflection); // click fate reflection to play as reaction
            this.player2.clickDie(4);
            this.player2.clickCard(this.mistSpirit);

            expect(this.mistSpirit.location).toBe('archives');
            expect(this.fateReflection.location).toBe('discard');
            expect(this.player2.hand.length).toBe(0);
            // does not get stuck on first resolution targets
            expect(this.player1).toHavePrompt('Meteor II');
        });
    });
});
