describe('Stunning Impact Aspect', function () {
    describe('With targets in spellboard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: ['abundance', 'strengthen'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['stunning-impact'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });
        });

        it('on attack forces ready spell return to hand', function () {
            this.strengthen.exhaust();
            expect(this.blightOfNeverset.redRains).toBe(0);
            this.player1.endTurn();
            // chimera attacks
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.player1).not.toHavePromptTitle('Attack');
            expect(this.player1).not.toBeAbleToSelect(this.strengthen);

            this.player1.clickCard(this.abundance);
            expect(this.abundance.location).toBe('hand');
        });
    });

    describe('With no spellboard target', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'], // 2 defenders to prevent ping removal - breaks for expect below.
                    spellboard: ['strengthen'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['stunning-impact'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['scarlet-seed']
                }
            });
        });

        it('no prompt', function () {
            this.strengthen.exhaust();
            expect(this.blightOfNeverset.redRains).toBe(0);
            this.player1.endTurn();
            // chimera attacks
            expect(this.game.attackState.isPBAttack).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.strengthen);
            expect(this.player1).toHavePromptTitle('Attack');
        });
    });
});
