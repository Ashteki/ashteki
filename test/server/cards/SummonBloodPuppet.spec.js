describe('Summon Blood Puppet', function () {
    describe('positive tests', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-blood-puppet'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    archives: ['blood-puppet'],
                    deck: ['iron-worker', 'anchornaut'],
                    hand: ['iron-worker', 'anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm']
                }
            });
        });

        it('should place a blood puppet onto own battlefield', function () {
            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt('Mine');

            // Blood puppet is now on the battlefield
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player2.inPlay.length).toBe(0);

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.endTurn();

            // keep dice prompts, end round
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.player1.phoenixborn.damage).toBe(1);
        });

        it('should place a blood puppet onto opponents battlefield', function () {
            expect(this.player2.side).toBe(1);

            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");

            // Blood puppet is now on the battlefield
            expect(this.player1.inPlay.length).toBe(0);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.bloodPuppet.controller.id).toBe('222');

            this.player1.endTurn();
            this.player2.clickCard(this.bloodPuppet);
            expect(this.player2).toHavePromptButton('Self Inflict');
            this.player2.clickPrompt('Self Inflict');
            this.player2.clickDie(0);
            expect(this.player2.side).toBe(0);
            expect(this.bloodPuppet.damage).toBe(1);

            this.player2.endTurn();
            this.player1.endTurn();

            // keep dice prompts, end round
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            expect(this.player2.phoenixborn.damage).toBe(1);
        });
    });

    describe('negative tests', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-blood-puppet'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['anchornaut', 'anchornaut', 'hammer-knight', 'hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should NOT place a blood puppet onto full opponents battlefield', function () {
            expect(this.player2.phoenixborn.battlefield).toBe(4); // make sure we're full
            expect(this.player2.player.isBattlefieldFull()).toBe(true);
            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");

            // Blood puppet is now on the battlefield
            expect(this.player1.inPlay.length).toBe(0);
            expect(this.player2.inPlay.length).toBe(4);
        });
    });
});
