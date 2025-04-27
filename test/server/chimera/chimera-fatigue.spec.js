describe('Chimera fatigue', function () {
    describe('empty deck at recovery phase refill', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'time', 'time'],
                    spellboard: ['summon-ash-spirit', 'summon-butterfly-monk', 'summon-orchid-dove', 'summon-orchid-dove', 'summon-orchid-dove'],
                    archives: ['orchid-dove', 'ash-spirit'],
                    deck: ['purge', 'summon-gilder'],
                    hand: ['generosity']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: ['iron-scales', 'constrict', 'firebelly', 'lurk'],
                    deck: ['rampage', 'hunting-instincts', 'warcry']
                }
            });
        });

        it('fatigue triggers when deck is empty', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(4);
            expect(this.player2.fatigued).toBe(false);

            this.player1.endTurn();
            this.player1.clickDie(0);
            this.player1.clickDone();

            this.player1.clickPrompt('Ok'); // fatigue alert
            // next turn
            expect(this.game.round).toBe(2);
            // deck is empty
            expect(this.player2.deck.length).toBe(1); // reshuffled from discard, but then played to threatzone
            expect(this.player2.threatZone.length).toBe(4); // refilled from reshuffled deck
            expect(this.player2.fatigued).toBe(true);
        });

        it('BUG: should trigger when emptied by draw card', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(4);
            expect(this.player2.fatigued).toBe(false);

            this.player1.play(this.generosity);
            this.player1.clickDie(5);
            this.player1.clickPrompt('heal');
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('draw'); // chimera choice;

            this.player1.clickPrompt('Ok'); // fatigue alert
            expect(this.game.round).toBe(1);
            // deck is empty
            expect(this.player2.deck.length).toBe(5); // reshuffled from discard
            expect(this.player2.fatigued).toBe(true);
        });

        it('BUG: should trigger when exactly emptied by draw card', function () {
            // trim filler cards
            this.player2.player.deck = [this.rampage, this.huntingInstincts, this.warcry];
            expect(this.player2.deck.length).toBe(3);
            expect(this.player2.discard.length).toBe(4);
            expect(this.player2.fatigued).toBe(false);

            this.player1.play(this.generosity);
            this.player1.clickDie(5);

            this.player1.clickPrompt('heal');
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('draw'); // chimera choice;

            this.player1.clickPrompt('Ok'); // fatigue alert
            expect(this.game.round).toBe(1);
            // deck is refilled empty
            expect(this.player2.deck.length).toBe(7); // reshuffled from discard
            expect(this.player2.fatigued).toBe(true);
        });

        it('BUG: player meditation should not cause damage', function () {
            this.player1.dicepool[0].level = 'basic';
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1);
            expect(this.player2.discard.length).toBe(4);
            this.player2.player.applyFatigue();

            this.player1.clickPrompt('Meditate');
            this.player1.clickPrompt('Choose top Of Deck');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Confirm');
            this.player1.clickPrompt('Stop meditating');

            expect(this.player2.phoenixborn.damage).toBe(0);
        });

        it('BUG: summon orchid dove focus 2 should deal 1 damage to fatigued chimera', function () {
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1); // not empty but considered empty
            expect(this.player2.discard.length).toBe(4);
            this.player2.player.applyFatigue();
            expect(this.player2.fatigued).toBe(true);

            this.player1.clickCard(this.summonOrchidDove);
            this.player1.clickPrompt('Summon Orchid Dove');
            this.player1.clickDie(0);

            expect(this.orchidDove.location).toBe('play area');
            this.player1.clickYes();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.phoenixborn.damage).toBe(1);
        });

        it('fatigued Chimera cannot draw: summon ash spirit does not chimera draw', function () {
            this.player2.player.applyFatigue();

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');

            expect(this.ashSpirit.location).toBe('play area');
            expect(this.corpseOfViros.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('bug test', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['orchid-dove', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'summon-orchid-dove',
                        'summon-orchid-dove',
                        'summon-orchid-dove'
                    ],
                    archives: []
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: ['iron-scales', 'constrict', 'firebelly', 'lurk'],
                    deck: ['rampage']
                }
            });
        });

        it('BUG: orchid dove death discard should deal 1 damage to fatigued chimera', function () {
            this.player2.player.deck = [this.rampage];
            expect(this.player2.deck.length).toBe(1); // not empty but considered empty
            expect(this.player2.discard.length).toBe(4);
            this.player2.player.applyFatigue();
            expect(this.player2.fatigued).toBe(true);

            this.player1.clickDie(0);
            this.player1.clickPrompt('Natural Dice Power');
            this.player1.clickCard(this.orchidDove);

            this.player1.clickYes();
            expect(this.orchidDove.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.phoenixborn.damage).toBe(1);
        });
    });
});
