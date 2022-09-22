describe('Reclaim Soul', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight', 'ritualist'],
                dicepool: ['divine', 'charm', 'time', 'ceremonial'],
                hand: ['reclaim-soul'],
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

        this.odetteDiamondcrest.tokens.damage = 5;
    });

    it('bug vs ritualist - error reported', function () {
        expect(this.odetteDiamondcrest.damage).toBe(5);
        this.player1.play(this.reclaimSoul);

        this.player1.clickCard(this.ritualist);

        expect(this.odetteDiamondcrest.damage).toBe(3);
    });
});
