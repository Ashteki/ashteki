describe('Rile the Meek', function () {
    function setup(inPlay) {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay,
                dicepool: ['charm'],
                hand: ['rile-the-meek']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                inPlay: ['seaside-raven', 'mist-spirit', 'anchornaut']
            }
        });
    }

    it('does nothing if the player has no units that are 0 attack', function () {
        setup.bind(this)(['frostback-bear', 'ice-golem']);
        this.player1.play(this.rileTheMeek);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('does nothing if the player has no units that are unexahusted', function () {
        setup.bind(this)(['three-eyed-owl']);
        this.threeEyedOwl.tokens.exhaustion = 1;
        this.player1.play(this.rileTheMeek);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('pings once for each unit that is unexhausted and 0 attack', function () {
        setup.bind(this)(['frostback-bear', 'three-eyed-owl', 'ash-spirit', 'gilder']);
        this.ashSpirit.tokens.exhaustion = 1; //2 total damage
        this.player1.play(this.rileTheMeek);
        expect(this.player1).toHavePrompt('Choose a target to deal 1 damage');
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player1).toHavePrompt('Choose a target to deal 1 damage');
        this.player1.clickCard(this.seasideRaven);
        expect(this.seasideRaven.location).toBe('play area');
        expect(this.seasideRaven.damage).toBe(1);
    });

    it('lets you skip pings', function () {
        setup.bind(this)(['frostback-bear', 'three-eyed-owl', 'ash-spirit', 'gilder']); //3 total damage
        this.player1.play(this.rileTheMeek);
        expect(this.player1).toHavePrompt('Choose a target to deal 1 damage');
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player1).toHavePrompt('Choose a target to deal 1 damage');
        this.player1.clickPrompt('Done');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
