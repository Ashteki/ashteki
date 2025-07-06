const monk = require('monk');
const moment = require('moment');

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
let db = monk(mongoUrl);

const toDate = moment().subtract(3, 'months');

const gameFindSpec = { saveReplay: true };
gameFindSpec.startedAt = { $lt: toDate.toDate() };

const replayFindSpec = {};
replayFindSpec.timeStamp = { $lt: toDate.toDate() };

console.log('deleting old replays: ' + toDate.format('YYYY-MM-DD'));
const replays = db.get('replays');
replays.remove(replayFindSpec).then((result) => {
    // Updated the document with the field a equal to 2
    console.log(result);
    console.log('deleted old replays');
});

const collection = db.get('games');
collection
    .update(
        gameFindSpec,
        {
            $set: {
                saveReplay: false
            }
        },
        {
            multi: true
        }
    )
    .then((result) => {
        console.log('updated games');
        console.log(result);
    })
    .then(() => db.close());
