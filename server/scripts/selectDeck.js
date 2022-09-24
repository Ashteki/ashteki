const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('selecting deck: ' + process.argv[2]);
const collection = db.get('decks');
collection
    .find({ _id: process.argv[2] })
    .then((result) => {
        result.forEach(deck => {
            console.log(deck);
        })
    })
    .then(() => db.close());
