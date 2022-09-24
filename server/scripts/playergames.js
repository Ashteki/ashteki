const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('selecting games for: ' + process.argv[2]);
const collection = db.get('games');

try {
    collection
        .find({ 'players.name': process.argv[2] })
        .then((result) => {
            console.log('hello');
            result.forEach(game => {
                console.log(game);
            })
            // console.log(result);
        })
        .then(() => db.close());
} catch (e) {
    console.log(e);
}