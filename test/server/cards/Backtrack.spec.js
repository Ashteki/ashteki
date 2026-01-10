describe('Backtrack', function () {
    describe('standard test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'anchornaut', 'mist-spirit', 'string-mage'],
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['backtrack', 'molten-gold'],
                    inPlay: ['iron-rhino']
                }
            });
        });

        it('return single attacker to hand', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();

            this.player2.clickCard(this.backtrack);
            this.player2.clickCard(this.moltenGold); // discard

            this.player2.clickCard(this.hammerKnight); // return to hand

            expect(this.backtrack.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
            expect(this.hammerKnight.location).toBe('hand');
            expect(this.hammerKnight.isAttacker).toBe(false);
        });

        it('return one of many ally attackers to hand', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickDone();

            this.player2.clickCard(this.backtrack);
            this.player2.clickCard(this.moltenGold); // discard

            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).not.toBeAbleToSelect(this.mistSpirit);
            expect(this.player2).not.toBeAbleToSelect(this.stringMage);

            this.player2.clickCard(this.hammerKnight); // return to hand

            expect(this.backtrack.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
            expect(this.hammerKnight.location).toBe('hand');
            expect(this.hammerKnight.isAttacker).toBe(false);

            expect(this.game.attackState.battles.length).toBe(2);
        });
    });

    describe('vs chimera aspects', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'anchornaut', 'mist-spirit', 'string-mage'],
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['iron-worker', 'backtrack', 'purge']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['hunting-instincts', 'rampage'],
                    deck: []
                }
            });
        });

        it('return single attacker to hand', function () {
            this.player1.endTurn();
            // chimera should attack with hunting instincts

            this.player1.clickCard(this.backtrack);
            this.player1.clickCard(this.purge); // discard

            // return to hand (draw pile for chimera once resolved)
            this.player1.clickCard(this.huntingInstincts);

            expect(this.backtrack.location).toBe('discard');
            expect(this.purge.location).toBe('discard');
            expect(this.huntingInstincts.location).toBe('deck');
            expect(this.huntingInstincts.isAttacker).toBe(false);
            expect(this.player2.hand.length).toBe(0);
        });
    });
});
