describe('Flash Strike', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker', 'time-hopper'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['time', 'natural', 'illusion'],
                hand: ['flash-strike']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'sunshield-sentry'],
                spellboard: [],
                hand: ['summon-sleeping-widows'],
                archives: ['sleeping-widow']
            }
        });

        this.mistSpirit.tokens.status = 1;
        this.timeHopper.tokens.status = 1;
        this.fluteMage.tokens.status = 1;
    });

    it('No reaction on attack cancel', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player1.clickPrompt('Cancel');

        expect(this.player1).not.toHavePrompt('Any Reactions to defenders being declared?');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('prompts for warning if no status token attackers', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player2.clickDone(); // no guard

        expect(this.player1).toHavePrompt('Any Reactions to defenders being declared?');
        this.player1.clickCard(this.flashStrike);

        // warning on attackers with no status
        this.player1.clickYes();
        this.player1.clickCard(this.mistSpirit);

        expect(this.player1.dicepool[0].exhausted).toBe(true);
        expect(this.mistSpirit.attack).toBe(3);
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.ironWorker.location).toBe('play area');
        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.fluteMage.location).toBe('discard');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('cancel after warning', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player2.clickDone(); // no guard

        expect(this.player1).toHavePrompt('Any Reactions to defenders being declared?');
        this.player1.clickCard(this.flashStrike);

        // warning on attackers with no status
        this.player1.clickNo();
        this.player1.clickCard(this.mistSpirit);

        expect(this.player1.dicepool[0].exhausted).toBe(false);
        expect(this.mistSpirit.attack).toBe(1);
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.ironWorker.location).toBe('play area');
        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.fluteMage.location).toBe('discard');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('reaction on guard choice - unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player2.clickDone(); // no guard

        expect(this.player1).toHavePrompt('Any Reactions to defenders being declared?');
        this.player1.clickCard(this.flashStrike);

        //needs status tokens
        expect(this.player1).toBeAbleToSelect(this.mistSpirit);
        expect(this.player1).toBeAbleToSelect(this.timeHopper);
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.fluteMage);

        this.player1.clickCard(this.mistSpirit);

        expect(this.player1.dicepool[0].exhausted).toBe(true);
        expect(this.mistSpirit.attack).toBe(3);
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.fluteMage.location).toBe('discard');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('occurs after WHEN blockers declared effects, such as sunshield sentry', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.timeHopper);
        this.player1.clickDone();

        //block
        this.player2.clickCard(this.sunshieldSentry);
        this.player2.clickCard(this.mistSpirit);
        this.player2.clickDone();

        expect(this.player2).toBeAbleToSelect(this.sunshieldSentry); //any reactions
        this.player2.clickCard(this.sunshieldSentry);
        this.player2.clickCard(this.timeHopper);

        expect(this.player1).toBeAbleToSelect(this.flashStrike); //any reactions

        this.player1.clickCard(this.flashStrike);

        //can do any status token unit, not just attackers
        expect(this.player1).toBeAbleToSelect(this.mistSpirit);
        expect(this.player1).toBeAbleToSelect(this.timeHopper);

        this.player1.clickCard(this.mistSpirit);

        expect(this.player1.dicepool[0].exhausted).toBe(true);

        expect(this.mistSpirit.location).toBe('archives'); //it still died to sentry
        expect(this.sunshieldSentry.damage).toBe(3);
        expect(this.timeHopper.location).toBe('play area');
        expect(this.timeHopper.exhausted).toBe(false);

        expect(this.coalRoarkwin.damage).toBe(0);
    });
});
