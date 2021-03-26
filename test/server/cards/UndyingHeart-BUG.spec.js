describe('Undying heart BUG', function () {
    describe('bug 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['blood-shaman'],
                    dicepool: ['natural', 'illusion', 'charm', 'natural'],
                    spellboard: [],
                    hand: ['undying-heart', 'fear']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-rhino'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('returns destroyed blood shaman to hand after ATTACK', function () {
            this.player1.clickCard(this.undyingHeart); // play card
            this.player1.clickPrompt('Play this alteration');
            this.player1.clickCard(this.bloodShaman); // attach
            this.player1.endTurn();

            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.bloodShaman);
            this.player2.clickCard(this.ironRhino);
            this.player1.clickPrompt('Done'); // no guard
            this.player1.clickPrompt('No'); // no counter
            this.player1.clickYes();

            expect(this.undyingHeart.location).toBe('discard');
            expect(this.bloodShaman.location).toBe('hand');
        });

        it('returns destroyed blood shaman to hand after MG', function () {
            this.player1.clickCard(this.undyingHeart); // play card
            this.player1.clickPrompt('Play this alteration');
            this.player1.clickCard(this.bloodShaman); // attach
            this.player1.endTurn();

            this.player2.clickCard(this.moltenGold);
            this.player2.clickPrompt('Play this Action');
            this.player2.clickCard(this.bloodShaman);
            this.player1.clickYes();

            expect(this.undyingHeart.location).toBe('discard');
            expect(this.bloodShaman.location).toBe('hand');
        });
    });

    describe('bug 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['blood-archer'],
                    dicepool: [
                        'natural',
                        'illusion',
                        'charm',
                        'natural',
                        'ceremonial',
                        'charm',
                        'divine'
                    ],
                    spellboard: [],
                    hand: ['undying-heart', 'fear']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-rhino'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('when unit destroyed by fear', function () {
            this.player1.clickCard(this.undyingHeart); // play card
            this.player1.clickPrompt('Play this alteration');
            this.player1.clickCard(this.bloodArcher); // attach
            this.player1.clickCard(this.fear);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0);
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickYes();
            this.player1.clickPrompt('Pass'); // jessa ability pass

            expect(this.undyingHeart.location).toBe('discard');
            expect(this.bloodArcher.location).toBe('hand');
            this.player1.clickCard(this.ironRhino);
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.play(this.bloodArcher);
            this.player1.clickDie(6);
            this.player1.clickDone();

            expect(this.bloodArcher.location).toBe('play area');
            expect(this.bloodArcher.life).toBe(3);
        });
    });
});
