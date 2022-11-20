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
        {
            gameType: 'casual',
            label: {
                $in: [
                    'Ashcon',
                    'ashcon2',
                    'ashcon pod l',
                    'Ashcon2 Pod L',
                    'AshCon podQ',
                    'Ashcon 2',
                    'SBB',
                    'SB8',
                    'SB 8',
                    'SPQ1',
                    'SQP1',
                    'Ashcon pod A for Crescentus',
                    'PQLC'
                ]
            }
        },
        {
            $set: {
                gameType: 'competitive'
            }
        },
        { multi: true }
    )
    .then((result) => {
        console.log(result);
    })
    .then(() => db.close());
