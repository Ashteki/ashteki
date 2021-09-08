describe('Generosity', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: ['summon-gilder'],
                dicepool: ['charm'],
                hand: ['generosity'],
                deck: ['cover', 'fester', 'rising-horde', 'hollow']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['dread-wraith'],
                spellboard: ['summon-frostback-bear'],
                hand: ['rins-fury'],
                deck: ['cover', 'fester', 'rising-horde', 'hollow']
            }
        });
    });

    it('gives the players the proper choices of action based on previous choices', function () {
        this.summonGilder.tokens.exhaustion = 2;
        this.dreadWraith.tokens.damage = 4;

        this.player1.play(this.generosity);
        this.player1.clickDie(0);

        expect(this.player1).toHavePromptButton('Unexhaust');
        expect(this.player1).toHavePromptButton('Heal');
        expect(this.player1).toHavePromptButton('Draw');

        this.player1.clickPrompt('Unexhaust');
        this.player1.clickCard(this.summonGilder);

        expect(this.summonGilder.exhaustion).toBe(1);

        expect(this.player2).not.toHavePromptButton('Unexhaust');
        expect(this.player2).toHavePromptButton('Heal');
        expect(this.player2).toHavePromptButton('Draw');

        this.player2.clickPrompt('Heal');
        this.player2.clickCard(this.dreadWraith);
        expect(this.dreadWraith.damage).toBe(2);

        expect(this.player1).not.toHavePromptButton('Unexhaust');
        expect(this.player1).not.toHavePromptButton('Heal');
        expect(this.player1).toHavePromptButton('Draw');

        this.player1.clickPrompt('Draw');
        expect(this.player1.hand.length).toBe(3);
        expect(this.player1.deck.length).toBe(1);

        expect(this.player1).toHaveDefaultPrompt();
    });

    describe('unexhaustion', () => {
        it('lets you unexhaust phoenixborn', function () {
            this.coalRoarkwin.tokens.exhaustion = 1;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Unexhaust');
            this.player1.clickCard(this.coalRoarkwin);

            expect(this.coalRoarkwin.exhaustion).toBe(0);
        });

        it('lets you unexhaust ready spells', function () {
            this.summonGilder.tokens.exhaustion = 1;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Unexhaust');
            this.player1.clickCard(this.summonGilder);

            expect(this.summonGilder.exhaustion).toBe(0);
        });

        it('does not let you unexhaust units or opponent cards', function () {
            this.hammerKnight.tokens.exhaustion = 1;
            this.rinNorthfell.tokens.exhaustion = 1;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Unexhaust');

            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).not.toBeAbleToSelect(this.rinNorthfell);
        });
    });

    describe('healing', () => {
        it('lets you heal phoenixborn', function () {
            this.coalRoarkwin.tokens.damage = 2;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Heal');
            this.player1.clickCard(this.coalRoarkwin);

            expect(this.coalRoarkwin.damage).toBe(0);
        });

        it('lets you heal units', function () {
            this.hammerKnight.tokens.damage = 3;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Heal');
            this.player1.clickCard(this.hammerKnight);

            expect(this.hammerKnight.damage).toBe(1);
        });

        it('does not let you heal opponent cards', function () {
            this.dreadWraith.tokens.damage = 4;
            this.rinNorthfell.tokens.damage = 3;

            this.player1.play(this.generosity);
            this.player1.clickDie(0);

            this.player1.clickPrompt('Heal');

            expect(this.player1).not.toBeAbleToSelect(this.dreadWraith);
            expect(this.player1).not.toBeAbleToSelect(this.rinNorthfell);
        });
    });
});
