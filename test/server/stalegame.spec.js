describe('stale game check', function () {
  it('should find this is not stale', function () {
    const badGame = `{
            _id: 6143d3e5edf69e002e440d81,
            id: '01d1d0c0-1746-11ec-9457-2d537a559f37',
            expansions: { mm: true },
            gamePrivate: false,
            gameId: '01d1d0c0-1746-11ec-9457-2d537a559f37',
            gameType: 'competitive',
            players: [
              {
                deck: 'Harold Westraven',
                name: 'inquisitor0684',
                turn: null,
                wins: 0
              },
              { deck: 'Jessa Na Ni', name: 'nmc11', turn: null, wins: 0 }
            ],
            previousWinner: null,
            startedAt: 2021-09-16T23:29:58.732Z,
            swap: false
          }`;
    const games = { 'monkey': badGame };
    const timeout = 20 * 60 * 1000; // 1 hours
    let staleGames = Object.values(games).filter(
      (game) => game.finishedAt && Date.now() - game.finishedAt > timeout
    );
    expect(staleGames.length).toBe(0);
  });
});
