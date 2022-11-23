const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
// console.log('args: ' + process.argv.length)
let db = monk(mongoUrl);
let args = process.argv.slice(2);

console.log('updating game type for: ' + args[0]);

const collection = db.get('games');
collection
    .update(
        {
            gameId: args[0]
        },
        {
            $set: {
                gameType: args[1] || 'casual'
            }
        }
    )
    .then((result) => {
        console.log(result);
    })
    .then(() => db.close());
