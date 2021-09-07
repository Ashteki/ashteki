describe('Sunshield Sentry', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'james-endersight',
                inPlay: ['fallen', 'mist-spirit', 'raptor-herder', 'time-hopper']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['sunshield-sentry', 'sunshield-sentry', 'hammer-knight']
            }
        });
    });

    it('has alert', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard);

        this.player1.clickCard(this.fallen);
        this.player1.clickPrompt('Done');

        this.player2.clickCard(this.sunshieldSentry);
        this.player2.clickCard(this.fallen);
        this.player2.clickPrompt('Done');

        expect(this.fallen.location).toBe('archives');
        expect(this.sunshieldSentry.damage).toBe(1);
        expect(this.sunshieldSentry.exhausted).toBe(false);
    });

    it('deflects an unblocked unit', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard);

        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.raptorHerder);
        this.player1.clickPrompt('Done');

        this.player2.clickCard(this.sunshieldSentry);
        this.player2.clickCard(this.fallen);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.sunshieldSentry); //reaction
        this.player2.clickCard(this.mistSpirit); //choose mist spirit

        //resolve battles
        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.raptorHerder);

        expect(this.fallen.location).toBe('archives');
        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.exhausted).toBe(false);
        expect(this.raptorHerder.location).toBe('play area');
        expect(this.raptorHerder.exhausted).toBe(true);
        expect(this.aradelSummergaard.damage).toBe(1);
    });

    it('can not deflect if all units are blocked', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard);

        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done');

        this.player2.clickCard(this.sunshieldSentry);
        this.player2.clickCard(this.fallen);
        this.player2.clickCard(this.hammerKnight);
        this.player2.clickCard(this.mistSpirit);
        this.player2.clickPrompt('Done');

        expect(this.player2).toHavePrompt('Waiting for opponent'); //no reaction prompt

        //resolve battles
        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.mistSpirit);

        expect(this.fallen.location).toBe('archives');
        expect(this.sunshieldSentry.damage).toBe(1);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.hammerKnight.damage).toBe(1);
    });

    it('multiple sentries can deflect multiple units', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard);

        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.raptorHerder);
        this.player1.clickCard(this.timeHopper);
        this.player1.clickPrompt('Done');

        this.player2.clickCard(this.player2.player.cardsInPlay[0]); //sentry 1
        this.player2.clickCard(this.fallen);
        this.player2.clickCard(this.player2.player.cardsInPlay[1]); //sentry 2
        this.player2.clickCard(this.mistSpirit);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.player2.player.cardsInPlay[0]); //reaction
        this.player2.clickCard(this.raptorHerder); //choose herder
        this.player2.clickCard(this.player2.player.cardsInPlay[1]); //reaction
        this.player2.clickCard(this.timeHopper); //choose hopper

        //resolve battles
        this.player1.clickCard(this.fallen);
        this.player1.clickCard(this.mistSpirit);

        expect(this.fallen.location).toBe('archives');
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.raptorHerder.location).toBe('play area');
        expect(this.raptorHerder.exhausted).toBe(false);
        expect(this.timeHopper.location).toBe('play area');
        expect(this.timeHopper.exhausted).toBe(false);
        expect(this.aradelSummergaard.damage).toBe(0);
    });
});
