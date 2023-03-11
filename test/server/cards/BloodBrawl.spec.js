describe('Blood Brawl', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['frostback-bear', 'three-eyed-owl', 'ash-spirit', 'gilder'],
                dicepool: ['ceremonial'],
                hand: ['blood-brawl']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                inPlay: ['seaside-raven', 'mist-spirit', 'anchornaut']
            }
        });
    });

    it('does nothing if the player has no units that have damage', function () {
        this.player1.play(this.bloodBrawl);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('pings once for each unit wound', function () {
        this.ashSpirit.tokens.damage = 1;
        this.gilder.tokens.damage = 1; // 2 total damage

        this.player1.play(this.bloodBrawl);
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');
        this.player1.clickCard(this.seasideRaven);
        expect(this.seasideRaven.location).toBe('play area');
        expect(this.seasideRaven.damage).toBe(1);
    });

    it('lets you stop pings early ', function () {
        this.ashSpirit.tokens.damage = 1;
        this.gilder.tokens.damage = 1; // 2 total damage

        this.player1.play(this.bloodBrawl);
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.location).toBe('archives');
        this.player1.clickPrompt('Done');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
