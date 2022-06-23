const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('selecting game: ' + process.argv[2]);
const collection = db.get('games');
collection
    .find({ id: process.argv[2] })
    .then((result) => {
        result.forEach(game => {
            console.log(game);
        })
    })
    .then(() => db.close());
