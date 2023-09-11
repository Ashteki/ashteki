describe('Dice cycle', function () {
    describe('Player dice types', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse']
                }
            });

            this.player2.dicepool[0].level = 'power';
        });

        it('check for cycle up, and deselect of my dice', function () {
            this.player1.play(this.callUponTheRealms);
            const target = this.player1.dicepool[0];
            expect(target.level).toBe('power');

            this.player1.clickDie(0);
            expect(target.level).toBe('power');
            expect(this.player1.selectedDice.length).toBe(1);

            this.player1.clickDie(0);
            expect(target.level).toBe('class');
            expect(this.player1.selectedDice.length).toBe(1);

            this.player1.clickDie(0);
            expect(target.level).toBe('basic');
            expect(this.player1.selectedDice.length).toBe(1);

            this.player1.clickDie(0);
            expect(target.level).toBe('power');
            expect(this.player1.selectedDice.length).toBe(0);

            this.player1.clickDie(0); // add as power
            this.player1.clickDie(0); // reduce to class
            this.player1.clickPrompt('done');
            expect(target.level).toBe('class');
        });

        it('check for cycle down and deselect of opponent', function () {
            this.player1.play(this.moltenGold);
            this.player1.clickCard(this.anchornaut);

            this.player2.clickCard(this.shatterPulse);
            this.player2.clickDie(0);
            this.player2.clickPrompt('Done');

            this.player2.clickCard(this.mistSpirit); // destroy

            const target = this.player1.dicepool[2];

            expect(this.mistSpirit.location).toBe('archives');
            expect(target.level).toBe('power');

            this.player2.clickPrompt('player1');
            this.player2.clickOpponentDie(2);
            expect(target.level).toBe('basic');
            expect(this.player2.player.selectedDice.length).toBe(1);

            this.player2.clickOpponentDie(2);
            expect(target.level).toBe('class');
            expect(this.player2.player.selectedDice.length).toBe(1);

            this.player2.clickOpponentDie(2);
            expect(target.level).toBe('power');
            expect(this.player2.player.selectedDice.length).toBe(1);

            this.player2.clickOpponentDie(2);
            expect(target.level).toBe('power');
            expect(this.player2.player.selectedDice.length).toBe(0);

            this.player2.clickOpponentDie(2); // add as basic
            this.player2.clickOpponentDie(2); // increase to class
            this.player2.clickPrompt('Done');
            expect(target.level).toBe('class');
        });
    });

    describe('Rage Dice cycle', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['illusion', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'hollow']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player2.dicepool[0].level = 'power';
        });

        it('check for cycle down of opponent', function () {
            this.player1.play(this.hollow);
            const target = this.player2.dicepool[0];
            expect(target.level).toBe('power');

            this.player1.clickOpponentDie(0);
            this.player1.clickDone();
            expect(target.level).toBe('basic');
        });
    });
});
