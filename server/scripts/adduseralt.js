const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
// 2: user, 3: card id, 4..x: alt stubs
if (process.argv.length > 3) {
    let db = monk(mongoUrl);
    console.log('updating username: ' + process.argv[2] + ' alts for : ' + process.argv[3]);
    // prepare alts object
    const alts = process.argv.slice(4);
    const collection = db.get('users');
    collection
        .update(
            { username: process.argv[2] },
            {
                $set: {
                    ['altArts.' + process.argv[3]]: alts
                }
            }
        )
        .then((result) => {
            console.log(result);
        })
        .then(() => db.close());
}
