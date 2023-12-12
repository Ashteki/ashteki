describe('Summon Shimmer Wing', function () {
    describe('Ritual Flames', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-shimmer-wing'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    inPlay: ['shimmer-wing', 'shimmer-wing'],
                    archives: ['eternity-flame']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('discard two shimmer wings to put an eternity flame into play', function () {
            expect(this.player1.archives.length).toBe(1); // eternity flame
            const otherWing = this.player1.inPlay[1];
            this.player1.clickCard(this.shimmerWing);
            this.player1.clickPrompt('Ritual Flames');
            this.player1.clickDie(0);
            expect(this.player1).not.toBeAbleToSelect(this.shimmerWing);
            this.player1.clickCard(otherWing);
            expect(this.shimmerWing.location).toBe('archives');
            expect(this.eternityFlame.location).toBe('play area');
            expect(this.player1.archives.length).toBe(2); // 2x shimmer wing
        });
    });

    describe('Ritual Flames - only one shimmer wing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-shimmer-wing'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    inPlay: ['shimmer-wing'],
                    archives: ['eternity-flame', 'shimmer-wing']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('cannot discard two shimmer wings, shows a warning, then', function () {
            expect(this.player1.archives.length).toBe(2); // eternity flame + sw
            this.player1.clickCard(this.shimmerWing);
            this.player1.clickPrompt('Ritual Flames');
            expect(this.player1).not.toHaveDefaultPrompt; // warning
            this.player1.clickYes();
            this.player1.clickDie(0);
            expect(this.shimmerWing.location).toBe('archives');
            expect(this.eternityFlame.location).toBe('archives');
            expect(this.player1.archives.length).toBe(3); // source is discarded
        });
    });
});
