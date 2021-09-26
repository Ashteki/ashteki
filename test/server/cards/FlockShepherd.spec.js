describe('Flock Shepherd', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['frostback-bear', 'beast-mage'],
                dicepool: ['charm', 'divine', 'natural', 'illusion', 'illusion'],
                hand: ['steady-gaze']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: [
                    'flock-shepherd',
                    'ash-spirit',
                    'gilder',
                    'hammer-knight',
                    'squall-stallion'
                ]
            }
        });
    });

    describe('protect', function () {
        it('prevents spells from targeting 0 printed attack units with spells (not printed attack X)', function () {
            this.player1.play(this.steadyGaze);
            expect(this.player1).not.toBeAbleToSelect(this.ashSpirit);
            expect(this.player1).not.toBeAbleToSelect(this.gilder);
            expect(this.player1).toBeAbleToSelect(this.flockShepherd);
            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.squallStallion);
        });

        it('prevents dice powers from targeting 0 printed attack units with spells (not printed attack X)', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            expect(this.player1).not.toBeAbleToSelect(this.ashSpirit);
            expect(this.player1).not.toBeAbleToSelect(this.gilder);
            expect(this.player1).toBeAbleToSelect(this.flockShepherd);
            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.squallStallion);
        });

        it('prevents abilities from targeting 0 printed attack units with spells (not printed attack X)', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            expect(this.player1).not.toBeAbleToSelect(this.ashSpirit);
            expect(this.player1).not.toBeAbleToSelect(this.gilder);
            expect(this.player1).toBeAbleToSelect(this.flockShepherd);
            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.squallStallion);
        });

        it('does not prevent attacks', function () {
            this.player1.clickPrompt('Attack');
            expect(this.player1).toBeAbleToSelect(this.ashSpirit);
        });

        it('relies on printed attack and is not affected by changes such as dice', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.flockShepherd);
            this.player1.play(this.steadyGaze);
            expect(this.player1).toBeAbleToSelect(this.flockShepherd);
        });

        it('does not protect units when it is exhausted', function () {
            this.flockShepherd.tokens.exhaustion = 1;
            this.player1.play(this.steadyGaze);
            expect(this.player1).toBeAbleToSelect(this.ashSpirit);
        });
    });

    describe('gather', function () {
        it('lets you add 2 to the attack of units with 0 printed attack (not printed attack X)', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.beastMage);
            this.player1.clickPrompt('Done');

            this.player2.clickCard(this.flockShepherd);

            expect(this.ashSpirit.attack).toBe(2);
            expect(this.gilder.attack).toBe(2);
            expect(this.flockShepherd.attack).toBe(1); //not buffed
            expect(this.hammerKnight.attack).toBe(3); //not buffed
            expect(this.squallStallion.attack).toBe(0); //not buffed

            this.player2.clickCard(this.ashSpirit);
            this.player2.clickCard(this.frostbackBear);

            this.player2.clickCard(this.gilder);
            this.player2.clickCard(this.beastMage);

            this.player2.clickPrompt('Done');
        });

        it('does not buff attack when exhausted', function () {
            this.flockShepherd.tokens.exhaustion = 1;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.beastMage);
            this.player1.clickPrompt('Done');

            expect(this.player2).not.toBeAbleToSelect(this.flockShepherd);
            expect(this.player2).not.toBeAbleToSelect(this.ashSpirit);
            expect(this.player2).not.toBeAbleToSelect(this.gilder);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);

            expect(this.ashSpirit.attack).toBe(0);
            expect(this.gilder.attack).toBe(0);
        });

        it('allows you not to buff', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.beastMage);
            this.player1.clickPrompt('Done');

            expect(this.player2).toBeAbleToSelect(this.flockShepherd);
            expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');

            this.player2.clickPrompt('Pass');

            expect(this.ashSpirit.attack).toBe(0);
            expect(this.gilder.attack).toBe(0);

            //defenders
            expect(this.player2).not.toBeAbleToSelect(this.flockShepherd);
            expect(this.player2).not.toBeAbleToSelect(this.ashSpirit);
            expect(this.player2).not.toBeAbleToSelect(this.gilder);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
        });
    });
});
