const monk = require('monk');

class UserService {
    constructor(configService) {
        let db = monk(configService.getValue('mongo'));
        this.banlist = db.get('banlist');
    }

    async getBanList() {
        return this.banlist.find({});
    }

    async getEntryByIp(ip) {
        return this.banlist.findOne({ ip: ip });
    }

    async addBanlistEntry(entry) {
        let toAdd = {
            username: entry.username,
            userId: entry.userId,
            ip: entry.ip,
            added: new Date()
        };
        return this.banlist.insert(toAdd);
    }
}

module.exports = UserService;
