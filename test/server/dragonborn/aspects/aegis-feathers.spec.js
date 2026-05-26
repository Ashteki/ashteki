describe('Aegis Feathers', function () {
    describe('When Destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    inPlay: ['sear', 'aegis-feathers'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });

            this.sear.exhaust();
        });

        it('remove 1 exhaustion from leftmost aspect', function () {
            expect(this.sear.exhausted).toBe(true);
            this.player1.useDie(0);
            this.player1.clickCard(this.aegisFeathers);
            expect(this.aegisFeathers.location).toBe('discard');
            expect(this.sear.exhausted).toBe(false);
        });
    });

    describe('When Destroyed but leftmost is not exhausted', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    inPlay: ['sear', 'rapid-flight', 'aegis-feathers'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });

            this.rapidFlight.exhaust();
        });

        it('no impact to other exhausted units', function () {
            expect(this.sear.exhausted).toBe(false);
            expect(this.rapidFlight.exhausted).toBe(true);
            this.player1.useDie(0);
            this.player1.clickCard(this.aegisFeathers);
            expect(this.aegisFeathers.location).toBe('discard');
            expect(this.rapidFlight.exhausted).toBe(true);
        });
    });

    describe('When db is attacked', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    inPlay: ['sear', 'rapid-flight', 'aegis-feathers'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('aegis feathers should block', function () {
            this.player1.clickAttack(this.scathaKalani);

            this.player1.clickCard(this.mistSpirit);
            this.player1.clickDone();
            expect(this.aegisFeathers.location).toBe('discard');
        });
    });

});
