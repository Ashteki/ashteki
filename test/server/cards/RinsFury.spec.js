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
                    'stormwind-sniper',
                    'shadow-hound'
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

        // check no random unit death (bug #819)
        expect(this.player1.player.unitsInPlay.length).toBe(5);
        expect(this.player2.player.unitsInPlay.length).toBe(1);
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

        // attacker isn't destroyed
        expect(this.squallStallion.location).toBe('play area');
        expect(this.squallStallion.damage).toBe(0);

        // defender isn't destroyed (Squall Stallion bug #766 with Rin's Fury)
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.hammerKnight.damage).toBe(0);

        // check no random unit death (bug #819)
        expect(this.player1.player.unitsInPlay.length).toBe(6);
        expect(this.player2.player.unitsInPlay.length).toBe(1);
    });

    it('Stormwind Sniper damage is prevented, but cannot destroy', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.stormwindSniper); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click card to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker isn't destroyed
        expect(this.stormwindSniper.location).toBe('play area');
        expect(this.stormwindSniper.damage).toBe(0);

        // defender isn't destroyed (Squall Stallion bug #766 with Rin's Fury)
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.hammerKnight.damage).toBe(0);

        // check no random unit death (bug #819)
        expect(this.player1.player.unitsInPlay.length).toBe(6);
        expect(this.player2.player.unitsInPlay.length).toBe(1);
    });

    it('Shadow Hound damage is prevented, but cannot destroy', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.shadowHound); // single attacker

        //this.player2.clickPrompt('Done'); // no guard - can't guard Shadow Hound
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click card to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // attacker isn't destroyed
        expect(this.shadowHound.location).toBe('play area');
        expect(this.shadowHound.damage).toBe(0);

        // defender isn't destroyed (Squall Stallion bug #766 with Rin's Fury)
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.hammerKnight.damage).toBe(0);

        // check no random unit death (bug #819)
        expect(this.player1.player.unitsInPlay.length).toBe(6);
        expect(this.player2.player.unitsInPlay.length).toBe(1);
    });
});
