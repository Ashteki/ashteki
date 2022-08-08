describe('Ruin Dweller', function () {
    describe('to ash', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['seaside-raven', 'hammer-knight', 'iron-rhino'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    hand: ['redirect'],
                    inPlay: ['ruin-dweller', 'living-doll'],
                    dicepool: ['charm']
                }
            });
        });

        it('does not trigger after destroying outside of attacks', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('Water Blast');
            this.player1.clickCard(this.ruinDweller);

            expect(this.player1).toHaveDefaultPrompt();

            expect(this.ruinDweller.location).toBe('archives');
        });

        it('does not trigger when exhausted', function () {
            this.ruinDweller.tokens.exhaustion = 1;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ruinDweller);
            this.player1.clickCard(this.hammerKnight);

            this.player2.clickPrompt('Done'); // no blocker

            expect(this.player1).toHavePrompt('Aftershock 1');
            this.player1.clickCard(this.livingDoll);

            expect(this.ruinDweller.location).toBe('archives');
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('triggers when destroyed in attack. damage pb', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ruinDweller);
            this.player1.clickCard(this.hammerKnight);

            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickPrompt('No'); // no counter

            expect(this.player1).toHavePrompt('Aftershock 1');
            this.player1.clickCard(this.livingDoll);

            this.player2.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);
        });

        it('triggers when redirect to ruin dweller', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.livingDoll);
            this.player1.clickCard(this.hammerKnight);

            this.player2.clickCard(this.maeoniViper); // guard

            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickCard(this.ruinDweller); // redirect damage to ash spirit

            expect(this.player1).toHavePrompt('Aftershock 1');
            this.player1.clickCard(this.livingDoll);

            this.player2.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);
        });

        it('does not trigger when a different unit is killed', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.livingDoll);
            this.player1.clickCard(this.hammerKnight);

            this.player2.clickPrompt('Done'); // no blocker
            this.player2.clickPrompt('No'); // no counter

            expect(this.player1).toHavePrompt('Aftershock 1');
            this.player1.clickCard(this.ruinDweller);

            expect(this.ruinDweller.location).toBe('play area');
            expect(this.ruinDweller.damage).toBe(1);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('End of round', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    deck: ['kneel', 'anchornaut'],
                    hand: ['massive-growth', 'massive-growth', 'massive-growth', 'kneel', 'kneel']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    deck: ['kneel', 'anchornaut'],
                    spellboard: ['summon-ruin-dweller'],
                    hand: ['massive-growth', 'massive-growth', 'massive-growth', 'kneel', 'kneel'],
                    inPlay: ['ruin-dweller'],
                    dicepool: ['time']
                }
            });
        });

        it('damage target pb on round end', function () {
            this.player1.endTurn();
            this.player2.endTurn();

            this.player2.clickPrompt('Done');

            this.player2.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);
        });
    });
});
