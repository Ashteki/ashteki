describe('Excavate action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['divine', 'ceremonial', 'time'],
                hand: ['rapture'],
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

    it('destroy unexhausted ally, then 1 damage to all opp. units', function () {
        this.player1.play(this.rapture);
        this.player1.clickCard(this.anchornaut); // destroy

        expect(this.anchornaut.location).toBe('discard');
        this.player1.clickCard(this.silverSnake); // order AoE
        this.player1.clickCard(this.mistSpirit); // order AoE
        this.player1.clickCard(this.fireArcher); // order AoE

        expect(this.silverSnake.damage).toBe(1);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.fireArcher.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
