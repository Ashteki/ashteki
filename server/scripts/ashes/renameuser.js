const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';
console.log('attached to: ' + mongoUrl);
if (process.argv[3] !== '') {
    let db = monk(mongoUrl);
    console.log('updating username: ' + process.argv[2] + ' to: ' + process.argv[3]);
    const collection = db.get('users');
    collection
        .update(
            { username: process.argv[2] },
            {
                $set: {
                    username: process.argv[3]
                }
            }
        )
        .then((result) => {
            // Updated the document with the field a equal to 2
            console.log(result);
        })
        .then(() => db.close());
}
