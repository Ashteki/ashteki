describe('Star Prison', function () {
    describe('When attached', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['flute-mage', 'anchornaut'],
                    dicepool: ['artifice', 'charm', 'astral'],
                    hand: ['star-prison', 'massive-growth', 'purge'],
                    deck: [
                        'summon-gilder',
                        'hollow',
                        'tripwire',
                        'fate-reflection',
                        'summon-steadfast-guardian'
                    ]
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('forces class die lower at beginning of turn', function () {
            this.player2.dicepool[0].level = 'class';
            this.player1.play(this.starPrison);
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.exhausted).toBe(true);
            this.player1.endTurn();
            this.player2.clickDie(0);
            expect(this.player2.dicepool[0].level).toBe('basic');
            expect(this.starPrison.location).toBe('play area');
        });

        it('discard self if no class die lowered', function () {
            this.player1.play(this.starPrison);
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.exhausted).toBe(true);
            this.player1.endTurn();
            expect(this.player2.dicepool[0].level).toBe('power');
            expect(this.starPrison.location).toBe('discard');
            expect(this.player2).toHaveDefaultPrompt();
        });
    });

    describe('When attached vs Dragonborn', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['flute-mage', 'anchornaut'],
                    dicepool: ['artifice', 'charm', 'astral'],
                    hand: ['star-prison', 'massive-growth', 'purge'],
                    deck: [
                        'summon-gilder',
                        'hollow',
                        'tripwire',
                        'fate-reflection',
                        'summon-steadfast-guardian'
                    ]
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon'],
                    inPlay: ['radiant-flash', 'rapid-flight']
                }
            });
        });

        it('forces class die lower at beginning of turn', function () {
            this.player2.dicepool[0].level = 'class';
            this.player2.dicepool[1].level = 'class';
            this.player1.play(this.starPrison);
            this.player1.clickCard(this.radiantFlash);

            expect(this.radiantFlash.exhausted).toBe(true);
            this.player1.endTurn();
            this.player1.clickOpponentDie(0)
            expect(this.player2.dicepool[0].level).toBe('basic');
            expect(this.starPrison.location).toBe('play area');
        });
    });
});
