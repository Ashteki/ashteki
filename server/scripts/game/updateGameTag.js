const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
// console.log('args: ' + process.argv.length)
let db = monk(mongoUrl);
let args = process.argv.slice(2);
if (!args[1]) {
    process.exit();
}

console.log('updating game tag for: ' + args[0]);

const collection = db.get('games');
collection
    .update(
        {
            gameId: args[0]
        },
        {
            $set: {
                tag: args[1]
            }
        }
    )
    .then((result) => {
        console.log(result);
    })
    .then(() => db.close());
