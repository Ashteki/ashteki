describe('Excavate action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['divine', 'charm', 'time'],
                hand: ['excavate'],
                deck: [
                    'summon-butterfly-monk',
                    'kneel',
                    'summon-steadfast-guardian',
                    'purge',
                    'iron-worker'
                ],
                discard: ['raptor-herder']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'mist-spirit', 'fire-archer'],
                dicepool: ['divine', 'charm', 'natural'],
                spellboard: [],
                deck: ['summon-gilder', 'empower', 'purge'],
                discard: ['molten-gold']
            }
        });
    });

    it('discard 3 cards from deck then 1 to hand and deal 3 damage', function () {
        this.player1.player.deck = [
            this.summonButterflyMonk,
            this.kneel,
            this.summonSteadfastGuardian,
            this.purge,
            this.ironWorker
        ];
        this.player1.play(this.excavate);
        this.player1.clickDie(0);
        this.player1.clickDone();

        expect(this.player1.discard.length).toBe(4);
        expect(this.player1).not.toBeAbleToSelect(this.raptorHerder);
        this.player1.clickCard(this.kneel);
        expect(this.kneel.location).toBe('hand');

        this.player1.clickCard(this.silverSnake);
        expect(this.silverSnake.damage).toBe(3);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
