const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
// console.log('args: ' + process.argv.length)

let db = monk(mongoUrl);
console.log('updating game type beginner to casual');
// prepare alts object
const alts = process.argv.slice(4);
const collection = db.get('games');
collection
    .update(
        { gameType: 'beginner' },
        {
            $set: {
                gameType: 'casual'
            }
        },
        { multi: true }
    )
    .then((result) => {
        console.log(result);
    })
    .then(() => db.close());
