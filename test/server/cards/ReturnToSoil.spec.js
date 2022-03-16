describe('Return to soil action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['divine', 'charm', 'natural'],
                hand: ['return-to-soil'],
                deck: ['summon-butterfly-monk', 'kneel', 'summon-steadfast-guardian'],
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

    it('deals damage but does not destroy', function () {
        this.player1.clickCard(this.returnToSoil);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.silverSnake);
        expect(this.silverSnake.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('deals damage, destroys, discard ToD, then purges 2', function () {
        this.player1.clickCard(this.returnToSoil);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.player1).not.toHaveDefaultPrompt();

        expect(this.player2.discard.length).toBe(2);
        this.player1.clickCard(this.player2.discard[0]);
        this.player1.clickCard(this.moltenGold);
        this.player1.clickDone(0);

        expect(this.moltenGold.location).toBe('purged');
        expect(this.player2.player.purged.length).toBe(2);
    });

    it('deals damage, destroys, discard ToD, then purge cannot select unit just discarded', function () {
        this.player1.clickCard(this.returnToSoil);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.fireArcher);
        expect(this.fireArcher.location).toBe('discard');
        expect(this.player1).not.toHaveDefaultPrompt();

        expect(this.player2.discard.length).toBe(3);
        expect(this.player1).not.toBeAbleToSelect(this.fireArcher);
    });

    it('deals damage, destroys, discard ToD, then purges 2 when targetting own unit', function () {
        this.player1.clickCard(this.returnToSoil);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player1).not.toHaveDefaultPrompt();

        expect(this.player1.discard.length).toBe(3);
        this.player1.clickCard(this.player1.discard[0]);
        this.player1.clickCard(this.raptorHerder);
        this.player1.clickDone(0);

        expect(this.raptorHerder.location).toBe('purged');
        expect(this.player1.player.purged.length).toBe(2);
    });
});
