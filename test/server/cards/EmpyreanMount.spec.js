describe('Empyrean Mount', function () {
    describe('Battlemaster', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['empyrean-mount', 'fire-archer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: [],
                    archives: ['empyrean-mount']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('forces unit to block', function () {
            this.player1.clickPrompt('Attack');

            this.player1.clickCard(this.aradelSummergaard); // target PB
            this.player1.clickCard(this.empyreanMount); // attacker
            this.player1.clickCard(this.fireArcher); //attacker

            this.player1.clickPrompt('Done'); // 2 attackers

            expect(this.player1).toHavePrompt('Choose a unit to force it to block');
            this.player1.clickCard(this.fluteMage); // single blocker

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            this.player2.clickCard(this.hammerKnight);
            // EM and flute Mage unit are in battle together
            expect(this.game.attackState.battles[0].attacker).toBe(this.empyreanMount);
            expect(this.game.attackState.battles[0].guard).toBe(this.fluteMage);

            // player2 cannot swap out chosen blocker
            expect(this.player2).not.toBeAbleToSelect(this.empyreanMount);
            this.player2.clickCard(this.empyreanMount);

            // can assign / reassign blocker for other attacker
            this.player2.clickCard(this.fireArcher);
            expect(this.game.attackState.battles[1].guard).toBe(this.hammerKnight);

            // reset button does not clear chosen blocker
            this.player2.clickPrompt('Clear All');
            expect(this.game.attackState.battles[0].attacker).toBe(this.empyreanMount);
            expect(this.game.attackState.battles[0].guard).toBe(this.fluteMage);

            expect(this.game.attackState.battles[1].guard).toBe(null);
        });
    });

    describe('Battlemaster vs Stasis', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['empyrean-mount', 'fire-archer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: [],
                    archives: ['empyrean-mount']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['time'],
                    hand: ['stasis']
                }
            });
        });

        it('removal should free up unit to block others', function () {
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.empyreanMount); // attacker
            this.player1.clickCard(this.fireArcher); //attacker
            this.player1.clickPrompt('Done'); // 2 attackers

            this.player1.clickCard(this.fluteMage); // force empyrean mount blocker

            // EM and flute Mage unit are in battle together
            expect(this.game.attackState.battles[0].attacker).toBe(this.empyreanMount);
            expect(this.game.attackState.battles[0].guard).toBe(this.fluteMage);

            // p2 reaction - stasis
            this.player2.clickCard(this.stasis);
            this.player2.clickCard(this.empyreanMount); // target
            expect(this.empyreanMount.isAttacker).toBe(false);

            // can reassign target as blocker
            this.player2.clickCard(this.fluteMage);
            this.player2.clickCard(this.fireArcher);
            expect(this.game.attackState.battles[0].attacker).toBe(this.fireArcher);
            expect(this.game.attackState.battles[0].guard).toBe(this.fluteMage);

            // reset button clears blocker
            this.player2.clickPrompt('Clear All');
            expect(this.game.attackState.battles.every((b) => !b.guard));
        });
    });
});
