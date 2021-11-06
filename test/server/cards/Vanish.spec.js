describe('Vanish', function () {
    describe('', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                    hand: ['molten-gold', 'one-hundred-blades', 'phoenix-barrage']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('cancels one hundred blades', function () {
            this.player1.clickCard(this.oneHundredBlades);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt(
                'Any Reactions to one hundred blades targetting Rin Northfell?'
            );
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cancels molten gold on phoenixborn', function () {
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt('Any Reactions to molten gold targetting rin northfell?');
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cancels song of sorrow part 2', function () {
            const handSize = this.player2.hand.length;
            this.player1.clickCard(this.enchantedViolinist);
            this.player1.clickPrompt('Song Of Sorrow');
            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.location).toBe('archives');

            //expect(this.player2).toHavePrompt(
            //    'Any Reactions to Song of Sorrow targetting mist spirit?'
            //);

            expect(this.player2).toHavePrompt(
                'Any Reactions to Enchanted Violinist targetting you?'
            );

            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.hand.length).toBe(handSize - 1);
        });

        it('cancels Phoenix Barrage part 3', function () {
            this.player1.play(this.phoenixBarrage);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.hammerKnight);
            //this.player1.clickCard(this.mistSpirit);
            //expect(this.mistSpirit.location).toBe('archives');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt(
                'Any Reactions to Phoenix Barrage targetting Rin Northfell?'
            );
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['enchanted-violinist'],
                    dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                    hand: ['anguish', 'one-hundred-blades']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['vanish', 'anchornaut']
                }
            });
        });

        it('should cancel anguish', function () {
            const handSize = this.player2.hand.length;
            this.player1.play(this.anguish);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.rinNorthfell);

            expect(this.player2).toHavePrompt('Any Reactions to anguish targetting rin northfell?');
            expect(this.player2).toBeAbleToSelect(this.vanish);
            this.player2.clickCard(this.vanish);

            expect(this.rinNorthfell.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.hand.length).toBe(handSize - 1);
        });
    });
});
