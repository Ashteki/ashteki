describe('Summon Butterfly Monk', function () {
    describe("Summon Butterfly Monk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-bone-crow', 'frost-bite'],
                    dicepool: ['ceremonial', 'ceremonial', 'charm', 'natural'],
                    archives: ['bone-crow']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    spellboard: []
                }
            });
        });

        it('should not place a bone crow into play', function () {
            this.player1.clickCard(this.summonBoneCrow);
            this.player1.clickPrompt('Summon Bone Crow');

            expect(this.boneCrow.location).toBe('archives');
        });

        it('should place a bone crow after unit is destroyed', function () {
            this.player1.clickCard(this.frostBite);
            this.player1.clickPrompt('Frost Bite');
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.location).toBe('archives');

            this.player1.clickCard(this.summonBoneCrow);
            this.player1.clickPrompt('Summon Bone Crow');

            expect(this.boneCrow.location).toBe('play area');
        });
    });
});
