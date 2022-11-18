const logger = require("./log");

// For details on Elo calculation, refer to https://en.wikipedia.org/wiki/Elo_rating_system
const GameResult = {
    Win: 1,
    Draw: 0.5,
    Loss: 0
};

const RankFactors = {
    Beginner: { lower: 0, upper: 2100, kFactor: 32 },
    Advanced: { lower: 2100, upper: 2400, kFactor: 24 },
    Pro: { lower: 2400, upper: 5000, kFactor: 16 }
};

const defaultElo = 1500;

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
        if (rating < RankFactors.Beginner.upper)
            return RankFactors.Beginner.kFactor;
        else if (rating >= RankFactors.Advanced.lower && rating <= RankFactors.Advanced.upper)
            return RankFactors.Advanced.kFactor;
        else
            return RankFactors.Pro.kFactor;
    }

    calculateExpectedResults(players) {
        let playerA = players[0];
        let playerB = players[1];
        let playerARating = playerA.user?.eloRating || defaultElo;

        let playerBRating = playerB.user?.eloRating || defaultElo;
        playerA.expectedScore = this.calculateExpectedScore(playerARating, playerBRating);
        logger.info('playerA expected score %s', playerA.expectedScore);
        playerB.expectedScore = this.calculateExpectedScore(playerBRating, playerARating);
        logger.info('playerB expected score %s', playerB.expectedScore);
    }

    calculateNewResults(players, winner) {
        for (const p of players) {
            let newRating = this.calculateUpdatedRating(
                p.user?.eloRating || defaultElo,
                p.expectedScore,
                p.name === winner ? GameResult.Win : GameResult.Loss
            );
            p.user.eloRating = newRating;
        }
    }
}

module.exports = {
    EloCalculator
};
