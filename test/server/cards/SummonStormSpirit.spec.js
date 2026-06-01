describe('Summon Storm Spirit', function () {
    describe('not focussed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk', 'abundance', 'summon-storm-spirit'],
                    hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['storm-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('normal cost to summon', function () {
            this.player1.clickCard(this.summonStormSpirit);
            this.player1.clickPrompt('Summon Storm Spirit');
            this.player1.clickDie(0);
            expect(this.stormSpirit.location).toBe('play area');
            expect(this.player1.actions.main).toBe(false);
            expect(this.summonStormSpirit.exhausted).toBe(true);
            this.player1.clickOpponentDie(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
    describe('focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                    spellboard: ['summon-storm-spirit', 'summon-storm-spirit'],
                    hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['storm-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('choose side cost (and basic die) to summon', function () {
            this.player1.clickCard(this.summonStormSpirit);
            this.player1.clickPrompt('Summon Storm Spirit');
            this.player1.clickPrompt('Side');
            this.player1.clickDie(2);
            expect(this.stormSpirit.location).toBe('play area');
            expect(this.player1.actions.main).toBe(true);
            expect(this.player1.actions.side).toBe(0);
            expect(this.summonStormSpirit.exhausted).toBe(true);
            this.player1.clickOpponentDie(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
