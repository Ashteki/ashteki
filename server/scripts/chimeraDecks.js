const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);
console.log('selecting chimera decks');
const collection = db.get('precon_decks');
collection
    .find({ mode: 'chimera' })
    .then((result) => {
        result.forEach(deck => {
            console.log(deck);
        })
    })
    .then(() => db.close());
