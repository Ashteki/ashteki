const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('updating conji count for errata: ' + process.argv[2] + ' count: ' + process.argv[3]);
const collection = db.get('decks');
collection
    .update(
        { 'conjurations.id': process.argv[2] },
        { $set: { 'conjurations.$.count': process.argv[3] } },
        { multi: true }
    )
    .then((result) => {
        // Updated the document with the field a equal to 2
        console.log(result);
    })
    .then(() => db.close());

