describe('Channel Magic', function () {
    describe('Basic test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['time', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'channel-magic'],
                    deck: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });

            this.aradelSummergaard.tokens.damage = 2;
            this.player1.player.deck = [this.hammerKnight];
        });

        it('when played, draw, heal pb, and raises 3 dice', function () {
            // fudge dice
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'class';
            this.player1.dicepool[3].level = 'basic';

            this.player1.play(this.channelMagic); // play card
            this.player1.clickDie(0);

            this.player1.clickCard(this.aradelSummergaard); // heal 1
            expect(this.aradelSummergaard.damage).toBe(1);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('power');
            expect(this.player1.dicepool[3].level).toBe('class');

            expect(this.hammerKnight.location).toBe('hand');
        });
    });

    describe('when pb not wounded', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['time', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'channel-magic'],
                    deck: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });

            this.player1.player.deck = [this.hammerKnight];
        });

        it('when played, draw, and raises 3 dice', function () {
            // fudge dice
            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'class';
            this.player1.dicepool[3].level = 'basic';

            this.player1.play(this.channelMagic); // play card
            this.player1.clickDie(0);

            this.player1.clickCard(this.aradelSummergaard); // heal 1
            expect(this.aradelSummergaard.damage).toBe(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('power');
            expect(this.player1.dicepool[3].level).toBe('class');

            expect(this.hammerKnight.location).toBe('hand');
        });
    });
});