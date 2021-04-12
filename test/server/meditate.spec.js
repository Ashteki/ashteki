describe('Meditate', function () {
    describe('standard', function () {
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

            this.player1.dicepool[0].level = 'basic';
            this.player1.dicepool[1].level = 'class';
        });

        it('Simple meditate topofdeck, die to power side', function () {
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[0];
            expect(target.level).toBe('basic');

            this.player1.clickPrompt('Choose top Of Deck');

            this.player1.clickDie(0);

            expect(target.level).toBe('power');

            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(target.level).toBe('power');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Meditate topofdeck, cycle die to class side', function () {
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[0];
            expect(target.level).toBe('basic');

            this.player1.clickPrompt('Choose top Of Deck');

            this.player1.clickDie(0);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(target.level).toBe('class');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Meditate topofdeck, deselect die to choose same', function () {
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[0];
            expect(target.level).toBe('basic');

            this.player1.clickPrompt('Choose top Of Deck');

            this.player1.clickDie(0);
            expect(target.level).toBe('power');
            this.player1.clickDie(0);
            expect(target.level).toBe('class');
            this.player1.clickDie(0);
            expect(target.level).toBe('basic');
            this.player1.clickDie(0); // deselect

            expect(target.level).toBe('basic'); // initial value
            expect(this.player1.selectedDice.length).toBe(0);

            this.player1.clickDie(0);
            expect(target.level).toBe('power');
            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Meditate topofdeck, deselect die to choose other', function () {
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[1];
            expect(target.level).toBe('class');

            this.player1.clickPrompt('Choose top Of Deck');

            this.player1.clickDie(1);
            expect(target.level).toBe('power');
            this.player1.clickDie(1);
            expect(target.level).toBe('class');
            this.player1.clickDie(1);
            expect(target.level).toBe('basic');
            this.player1.clickDie(1); // deselect

            expect(target.level).toBe('class'); // initial value
            expect(this.player1.selectedDice.length).toBe(0);

            this.player1.clickDie(0);
            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(this.player1.dicepool[0].level).toBe('power');
            expect(target.level).toBe('class'); // initial value
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Meditate topofdeck, must deselect before choosing another', function () {
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[1];
            expect(target.level).toBe('class');

            this.player1.clickPrompt('Choose top Of Deck');

            this.player1.clickDie(1);
            expect(target.level).toBe('power');

            // ignores this
            this.player1.clickDie(0);
            expect(this.player1.selectedDice.length).toBe(1);
            expect(this.player1.selectedDice[0]).toBe(target);

            this.player1.clickDie(1);
            expect(target.level).toBe('class');
            this.player1.clickDie(1);
            expect(target.level).toBe('basic');
            this.player1.clickDie(1); // deselect

            expect(target.level).toBe('class'); // initial value
            expect(this.player1.selectedDice.length).toBe(0);

            this.player1.clickDie(0);
            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(this.player1.dicepool[0].level).toBe('power');
            expect(target.level).toBe('class'); // initial value
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('full spellboard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize', 'empower', 'summon-gilder'],
                    dicepool: ['natural', 'illusion', 'illusion', 'charm'],
                    hand: ['shifting-mist']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse']
                }
            });

            this.player1.dicepool[0].level = 'basic';
            this.player1.dicepool[1].level = 'class';
        });

        it('meditate spell, leaves gap in spellboard', function () {
            expect(this.player1.player.isSpellboardFull()).toBe(true);
            this.player1.clickPrompt('Meditate');
            const target = this.player1.dicepool[0];
            expect(target.level).toBe('basic');

            this.player1.clickCard('empower');

            this.player1.clickDie(0);

            expect(target.level).toBe('power');

            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');
            expect(target.level).toBe('power');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.player.isSpellboardFull()).toBe(false);
            expect(this.shiftingMist.location).toBe('hand');
            this.player1.play(this.shiftingMist);
            expect(this.shiftingMist.location).toBe('spellboard');
        });
    });
});
