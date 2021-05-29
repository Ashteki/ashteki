describe('Beast tamer', function () {
    describe('attack reduction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['beast-tamer', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('reduces attack as attacker - unit atack', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker); // target
            this.player1.clickCard(this.beastTamer); // single attacker
            this.player2.clickPrompt('Done'); // no guard

            expect(this.player2).toHavePrompt('Do you want to counter?');
            expect(this.ironWorker.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(1);
            expect(this.anchornaut.attack).toBe(0);
            expect(this.anchornaut.effects.length).toBe(0);
            this.player2.clickPrompt('No'); // ends attack
            expect(this.ironWorker.attack).toBe(2);
        });

        it('reduces attack as attacker - PB atack', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.beastTamer); // single attacker
            this.player1.clickPrompt('Done'); // done
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.beastTamer);

            expect(this.ironWorker.attack).toBe(1);
            this.player2.clickPrompt('Done'); // done

            expect(this.ironWorker.location).toBe('discard');
            expect(this.beastTamer.damage).toBe(1);
            expect(this.ironWorker.attack).toBe(2);
        });

        it('reduces attack as attacker - PB atack - multi attacker', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.beastTamer);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickPrompt('Done'); // done
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.beastTamer);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.fluteMage);

            expect(this.ironWorker.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(1);
            expect(this.beastTamer.attack).toBe(2);
            expect(this.fluteMage.attack).toBe(1);
            this.player2.clickPrompt('Done'); // done

            this.player1.clickCard(this.beastTamer);
            expect(this.ironWorker.location).toBe('discard');
            expect(this.beastTamer.damage).toBe(1);
            expect(this.ironWorker.attack).toBe(2);
        });

        it('reduces attack as defender - PB atack', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.aradelSummergaard); // target
            this.player2.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done'); // done attackers
            this.player1.clickCard(this.beastTamer);
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.attack).toBe(1);
            this.player1.clickPrompt('Done'); // done

            expect(this.ironWorker.location).toBe('discard');
            expect(this.beastTamer.damage).toBe(1);
            expect(this.ironWorker.attack).toBe(2);
        });

        it('reduces attack as defender - PB atack multi-defender', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.aradelSummergaard); // target
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.fluteMage);
            this.player2.clickPrompt('Done'); // done attackers
            this.player1.clickCard(this.beastTamer);
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.attack).toBe(1);
            expect(this.fluteMage.attack).toBe(1);
            this.player1.clickPrompt('Done'); // done
            this.player2.clickCard(this.ironWorker); // resolve order
            this.player2.clickCard(this.fluteMage);

            expect(this.ironWorker.location).toBe('discard');
            expect(this.beastTamer.damage).toBe(1);
            expect(this.ironWorker.attack).toBe(2);
        });

        it('reduces attack as defender - unit attack', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.beastTamer); // target
            this.player2.clickCard(this.ironWorker); // attacker
            this.player1.clickPrompt('Done'); // no guard

            expect(this.player1).toHavePrompt('Do you want to counter?');
            expect(this.ironWorker.attack).toBe(1);
            expect(this.mistSpirit.attack).toBe(1);
            expect(this.anchornaut.attack).toBe(0);
            expect(this.anchornaut.effects.length).toBe(0);
            this.player1.clickPrompt('No'); // ends attack
            expect(this.ironWorker.attack).toBe(2);
        });

        it('does not reduce attack as defender - unit PB guard', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.beastTamer); // target
            this.player2.clickCard(this.ironWorker); // attacker
            this.player1.clickCard(this.aradelSummergaard); // no guard
            expect(this.aradelSummergaard.damage).toBe(2);
        });

        it('check for destroyed units', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker); // target
            this.player1.clickCard(this.beastTamer); // single attacker
            this.player2.clickPrompt('Done'); // no guard

            expect(this.player2).toHavePrompt('Do you want to counter?');
            expect(this.ironWorker.attack).toBe(1);
            this.player2.clickPrompt('Yes'); // ends attack
            expect(this.ironWorker.location).toBe('discard');
            expect(this.ironWorker.attack).toBe(2);
        });
    });

    describe('Bug report', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['beast-tamer', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('check for destroyed units', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker); // target
            this.player1.clickCard(this.beastTamer); // single attacker
            this.player2.clickPrompt('Done'); // no guard

            expect(this.player2).toHavePrompt('Do you want to counter?');
            expect(this.ironWorker.attack).toBe(1);
            this.player2.clickPrompt('Yes'); // ends attack
            expect(this.ironWorker.location).toBe('discard');
            expect(this.ironWorker.attack).toBe(2);
        });
    });
});
