const logger = require('../log');

class AshesNewsService {
    constructor(db) {
        this.news = db.get('news');
    }

    async getRecentNewsItems(options) {
        var params = {};

        params.sort = { datePublished: -1 };
        if (options.limit) {
            params.limit = parseInt(options.limit);
        }

        return this.news.find({}, params);
    }

    async addNews(news) {
        return this.news.insert(news);
    }

    async deleteNews(id) {
        this.news.remove({ _id: id });
    }

    async editNews(id, text) {
        let props = {
            text: text
        };
        return this.news.update({ _id: id }, { $set: props }).catch((err) => {
            logger.error(err);
            throw new Error('Error updating news');
        });
    }
}

module.exports = AshesNewsService;
