const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('deleting game: ' + process.argv[2]);
const collection = db.get('games');
collection
    .remove({ _id: process.argv[2] })
    .then((result) => {
        // Updated the document with the field a equal to 2
        console.log(result);
    })
    .then(() => db.close());
