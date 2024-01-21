const monk = require('monk');

class LeagueService {
    constructor(configService) {
        const mongoUrl = process.env.LEAGUEDB_URL || configService.getValue('leaguedb');
        let db = monk(mongoUrl);
        this.pairings = db.get('pairings');
        this.nameLinks = db.get('namelinks');
    }

    async getLatest(tag) {
        return this.pairings
            .findOne(
                { tag: tag },
                {
                    sort: { _id: -1 },
                    limit: 1
                }
            )
            .catch((err) => {
                console.log('Unable to fetch latest pairings', err);
                throw new Error('Unable to fetch latest pairings ');
            });
    }

    async getPrevious(tag) {
        return this.pairings
            .find(
                { tag: tag },
                {
                    sort: { _id: -1 },
                    limit: 2
                }
            )
            .catch((err) => {
                console.log('Unable to fetch latest 2 pairings', err);
                throw new Error('Unable to fetch latest 2 pairings ');
            });
    }

    async getNameLinks() {
        return this.nameLinks
            .find(
                {},
                {
                    sort: { discordName: 1 }
                }
            )
            .catch((err) => {
                console.log('Unable to fetch nameLinks', err);
                throw new Error('Unable to fetch nameLinks ');
            });
    }
}

module.exports = LeagueService;
