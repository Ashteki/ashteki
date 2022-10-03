const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('redacting game: ' + process.argv[2] + ' User: ' + process.argv[3]);
const collection = db.get('games');
collection
    .update(
        { _id: process.argv[2], 'players.name': process.argv[3] },
        { $set: { 'players.$.name': process.argv[3] + '*' } }
    )
    .then((result) => {
        // Updated the document with the field a equal to 2
        console.log(result);
    })
    .then(() => db.close());

