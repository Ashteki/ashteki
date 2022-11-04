// For details on Elo calculation, refer to https://en.wikipedia.org/wiki/Elo_rating_system
const GameResult = {
    Win: 1,
    Draw: 0.5,
    Loss: 0
};

const RankFactors = {
    // [lowerlimit, upperlimit, k-factor]
    Beginner: [0, 2100, 32],
    Advanced: [2100, 2400, 24],
    Pro: [2400, 5000, 16]
}

class EloCalculator {

    calculateExpectedScore(playerARating, playerBRating) {
        return 1 / (1 + Math.pow(10, (playerBRating - playerARating) / 400));
    }

    calculateUpdatedRating(playerRating, expectedScore, playerResult) {
        return playerRating + this.getKFactor(playerRating) * (playerResult - expectedScore);
    }

    getKFactor(rating) {
        // The k-factor is the maximum possible adjustment
        // to a player's rating based on their current rating.
        if (rating < RankFactors.Beginner[1])
            return RankFactors.Beginner[2];
        else if (rating >= RankFactors.Advanced[0] && rating <= RankFactors.Advanced[1])
            return RankFactors.Advanced[2];
        else
            return RankFactors.Pro[2];
    }

    calculateExpectedResults(players) {
        let playerA = players[0];
        let playerB = players[1];
        let playerARating = playerA.eloRating;
        let playerBRating = playerB.eloRating;
        playerA.expectedScore = this.calculateExpectedScore(playerARating, playerBRating);
        playerB.expectedScore = this.calculateExpectedScore(playerBRating, playerARating);
    }

}

module.exports = {
    EloCalculator,
    GameResult
};
