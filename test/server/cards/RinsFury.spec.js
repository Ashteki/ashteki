describe('rins fury reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: [
                    'mist-spirit',
                    'iron-worker',
                    'fallen',
                    'squall-stallion',
                    'stormwind-sniper'
                ],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: [],
                hand: ['freezing-blast']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['rins-fury'],
                dicepool: ['natural', 'natural']
            }
        });

        // make sure the stallion can do damage
        this.squallStallion.tokens.status = 1;
    });

    it('can be played when a unit takes damage', function () {
        expect(this.ironWorker.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click cover to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker destroyed
        expect(this.ironWorker.location).toBe('discard');
        expect(this.hammerKnight.damage).toBe(0);
    });

    it('BUG: fallen damage is not prevented, but fallen is destroyed', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.fallen); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click cover to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker destroyed
        expect(this.fallen.location).toBe('archives');
        expect(this.hammerKnight.damage).toBe(1);
    });

    it('Squall Stallion damage is prevented, but cannot destroy', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.squallStallion); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click cover to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker destroyed
        expect(this.squallStallion.location).toBe('play area');
        expect(this.squallStallion.damage).toBe(0);
        expect(this.hammerKnight.damage).toBe(0);
    });

    it('Stormwind Sniper damage is prevented, but cannot destroy', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.stormwindSniper); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click cover to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker destroyed
        expect(this.stormwindSniper.location).toBe('play area');
        expect(this.stormwindSniper.damage).toBe(0);
        expect(this.hammerKnight.damage).toBe(0);
    });
});
