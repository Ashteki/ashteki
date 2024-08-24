const GameStateWriter = require('../../server/gamenode/GameStateWriter');

describe('Replay', function () {
    describe('Abundance example', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                    hand: ['anchornaut', 'purge'],
                    spellboard: ['abundance']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['mist-typhoon', 'arrogance']
                }
            });
        });

        it('check snapshot content', function () {
            const writer = new GameStateWriter(this.game);
            const replay = writer.getStateForReplay();
            expect(replay.players.player1.cardPiles.hand[0].id).toBe('anchornaut');
            expect(replay.players.player2.cardPiles.hand[0].id).toBe('mist-typhoon');
        });

        it('check normal state content', function () {
            const writer = new GameStateWriter(this.game);
            const replay = writer.getStateForPlayer(this.player1.player);
            expect(replay.players.player1.cardPiles.hand[0].id).toBe('anchornaut');
            expect(replay.players.player2.cardPiles.hand[0].id).toBeUndefined();
        });
    });
});
